---
description: PDF-to-Quiz upload flow — bu akış bozulmamalıdır
---

# QuizFlow Web — PDF → Quiz Akışı (Altın Kural)

Bu dosya, uygulamanın çekirdeğini oluşturan PDF yükleme ve quiz oluşturma akışını tanımlar.
**Bu akış gelecekte yapılacak tüm değişikliklerde referans alınmalı ve bozulmamalıdır.**

---

## Akış Diyagramı

```mermaid
flowchart TD
    A[PDF seç] --> B[SHA-256 Hash hesapla\ngenerateFileHash]
    B --> C{localStorage'da\nbu hash var mı?\nquizService.getLocalQuiz}
    C -->|EVET| C1[LocalStorage'dan quiz al]
    C1 --> C2[DB: user_quizzes.last_accessed_at güncelle\nquizService.checkUserLibrary]
    C2 --> G

    C -->|HAYIR| D{Supabase quizzes tablosunda\nhash var mı?\nquizService.getQuizByHash}

    D -->|EVET quizId var| E{user_quizzes'de\nglobal_quiz_id eşleşiyor mu?\nquizService.checkUserLibrary}
    E -->|EVET kullanıcıda var| E1[last_accessed_at güncelle]
    E1 --> LS[LocalStorage'a yaz\nlocalCache.saveQuiz]
    LS --> G

    E -->|HAYIR yeni kullanıcı için| F1[quizService.addQuizToLibrary\nquiz_folders'dan folder_id çek\nuser_folders upsert\nuser_quizzes upsert]
    F1 --> LS

    D -->|HAYIR yeni quiz| N1[Storage'a PDF yükle\nsupabase.storage.upload]
    N1 --> N2[Edge Fn: generate-quiz\nGemini API]
    N2 --> N3[quizService.saveQuizToDatabase\n---\nfindOrCreateFolder - race-condition safe\nuser_folders upsert - global_folder_id + custom_name\nquizzes INSERT - 23505 retry\nquiz_folders upsert - global log\nuser_quizzes upsert - global_quiz_id + user_folder_id]
    N3 --> LS

    G[/dashboard/quiz/id yönlendir/]
```

---

## Kritik Kurallar

1. **`user_quizzes.global_quiz_id`** — FK `quizzes.id`'ye bağlı. `quiz_id` değil.
2. **`user_quizzes.user_folder_id`** — FK `user_folders.id`'ye bağlı. Doğrudan `folders.id` değil.
3. **`user_folders.global_folder_id`** — FK `folders.id`'ye bağlı.
4. **LocalStorage** her başarılı sonuçta yazılmalıdır (`localCache.saveQuiz`).
5. **Race condition koruması:** `quizzes` insert 23505 hatası alırsa retry ile mevcut ID alınır.
6. **Kütüphane kontrolü:** Quiz global DB'de var ama kullanıcıda yoksa `addQuizToLibrary` çağrılır. Yeniden generate edilmez.

---

## İlgili Dosyalar

| Dosya | Rol |
|---|---|
| `lib/quizService.ts` | Tüm DB + cache işlemleri |
| `components/features/dashboard/QuizUpload.tsx` | UI + akış orkestrasyonu |
| `utils/supabase/schema_migration.sql` | DB migration |
| `utils/supabase/v_user_library.sql` | Library view |
| `supabase/functions/generate-quiz/index.ts` | AI quiz generation (Edge Function) |
