[![Netlify Status](https://api.netlify.com/api/v1/badges/46ae13a3-e441-4655-8046-059d65facb24/deploy-status)](https://app.netlify.com/sites/yp-messr/deploys)
# Веб приложение "Чат"

"Чат" это быстрое и оптимизированное SPA-приложение для общения с друзьями:

- Отправка текстовых сообщений
- Поддержка отправки фотографий, видео, ссылок
- Возможность создавать груповые чаты с неограниченным количеством собеседников
- Отптимизированная и быстрая работа

## Макет приложения

[Ссылка на Figma](https://www.figma.com/design/j2L3BRdydTCntvA4G7EjRI/middle.messenger.praktikum.yandex?node-id=0-1&t=XmE2OGrPSeJjJmmk-1)

## Описание

Общение с друзьями, коллегами, знакомство с новыми людьми - все это позволяет вам сделать "Чат". Вы можете создавать группы с неограниченным количеством участников! **Ограничений на темы обсуждения нет**. Мы не модерируем и не цензурируем чаты (потому что у нас нет на это денег)

[Ссылка на Netlify](https://yp-messr.netlify.app/chats)

### Страницы приложения

* [/login](https://yp-messr.netlify.app/login)
* [/signup](https://yp-messr.netlify.app/signup)
* [/chats](https://yp-messr.netlify.app/chats)
* [/profile](https://yp-messr.netlify.app/profile)
* [/500](https://yp-messr.netlify.app/500)
* [/404](https://yp-messr.netlify.app/404)

Также в приложении реализован роутинг для навигации по страницам при `нажатии стрелки вверх` или `кнопки пробела`

### Команды

- `npm run start` — сборка и запуск проекта на localhost:3000
- `npm run lint` — запуск ESLint
- `npm run lint:style` — запуск StyleLint

### Использованные технологии

* [Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars)
* [Vite](https://vite.dev/)
* [PostCSS](https://postcss.org/)
* [ESLint](https://eslint.org/)
* [StyleLint](https://stylelint.io/)
