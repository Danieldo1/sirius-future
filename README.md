# Система рефералов для школы

Эта система разработана для управления реферальной программой школы, включая генерацию реферальных ссылок, регистрацию новых пользователей и обработку платежей.

## Установка и запуск

1. Клонируйте репозиторий:
   ```
   git clone [URL вашего репозитория]
   cd [название директории проекта]
   ```

2. Установите зависимости:
   ```
   yarn install
   ```

3. Создайте файл `.env.local` и добавьте следующие переменные окружения:
   ```
   NEXTAUTH_SECRET=ваш_секретный_ключ
   MONGODB_URI=ваша_строка_подключения_к_mongodb
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Запустите проект в режиме разработки:
   ```
   yarn dev
   ```

5. Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

## API Эндпоинты

### 1. Генерация реферальной ссылки
- **URL**: `/api/referral/generate`
- **Метод**: GET
- **Аутентификация**: Требуется
- **Описание**: Генерирует уникальную реферальную ссылку для авторизованного пользователя.
- **Ответ**: 
  ```json
  {
    "referralLink": "http://localhost:3000/register?ref=XXXXXXXXXXXX",
    "referralCode": "XXXXXXXXXXXX"
  }
  ```

### 2. Регистрация пользователя
- **URL**: `/api/register`
- **Метод**: POST
- **Тело запроса**:
  ```json
  {
    "name": "Имя Фамилия",
    "email": "user@example.com",
    "password": "password123",
    "referralCode": "XXXXXXXXXXXX" // опционально
  }
  ```
- **Описание**: Регистрирует нового пользователя. Если указан реферальный код, связывает нового пользователя с реферером.
- **Ответ**: 
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### 3. Обработка платежа
- **URL**: `/api/payment/process`
- **Метод**: POST
- **Аутентификация**: Требуется
- **Тело запроса**:
  ```json
  {
    "number": "4111111111111111",
    "expirationMonth": "12",
    "expirationYear": "2025",
    "cvv": "123"
  }
  ```
- **Описание**: Обрабатывает платеж и добавляет уроки пользователю и его рефереру (если есть).
- **Ответ**: 
  ```json
  {
    "message": "Payment processed and lessons added successfully"
  }
  ```

### 4. Получение статистики рефералов
- **URL**: `/api/referral/statistics`
- **Метод**: GET
- **Аутентификация**: Требуется
- **Описание**: Возвращает статистику рефералов для авторизованного пользователя.
- **Ответ**: 
  ```json
  {
    "totalReferrals": 5,
    "totalSignups": 3,
    "referralDetails": [
      {
        "code": "XXXXXXXXXXXX",
        "signups": 2,
        "createdAt": "2023-05-20T12:00:00Z"
      },
      // ...
    ]
  }
  ```

### 5. Получение информации о пользователе
- **URL**: `/api/user/[id]`
- **Метод**: GET
- **Аутентификация**: Требуется
- **Описание**: Возвращает информацию о пользователе по его ID.
- **Ответ**: 
  ```json
  {
    "name": "Имя Фамилия",
    "phone": "+79165556973",
    "email": "user@example.com",
    "hasPurchasedLessons": true,
    "numberOfLessons": 4
  }
  ```

## Дополнительная информация

Для получения дополнительной информации о работе с Next.js, обратитесь к следующим ресурсам:

- [Документация Next.js](https://nextjs.org/docs) - узнайте о функциях и API Next.js.
- [Изучите Next.js](https://nextjs.org/learn) - интерактивный учебник по Next.js.