import type { Appeal } from '@/entities/appeal';

function iso(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

/**
 * Статичный набор для демо (Vercel без бэкенда).
 * Первые три — короткие примеры; далее — расширенный список для UI.
 */
export const mockAppeals: Appeal[] = [
  {
    id: 'demo-1',
    title: 'Пример обращения 1',
    description: 'Короткое демо-описание для презентации.',
    status: 'new',
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'demo-2',
    title: 'Пример обращения 2',
    description: 'В работе — пример статуса.',
    status: 'in_progress',
    createdAt: '2024-01-16T12:00:00.000Z',
    updatedAt: '2024-01-16T12:00:00.000Z',
  },
  {
    id: 'demo-3',
    title: 'Пример обращения 3',
    description: 'Закрытый кейс для демонстрации.',
    status: 'resolved',
    createdAt: '2024-01-17T12:00:00.000Z',
    updatedAt: '2024-01-17T12:00:00.000Z',
  },
  {
    id: 'apl-001',
    title: 'Сбой выгрузки в 1С',
    description:
      'После обновления модуля интеграции перестала проходить выгрузка заказов.',
    status: 'in_progress',
    createdAt: iso(2),
    updatedAt: iso(0),
    authorId: 'u-1',
  },
  {
    id: 'apl-002',
    title: 'Запрос доступа к отчёту по складу',
    description: 'Нужны права на раздел «Склад — остатки» для смены бригады.',
    status: 'new',
    createdAt: iso(1),
    updatedAt: iso(1),
    authorId: 'u-2',
  },
  {
    id: 'apl-003',
    title: 'Дубли контрагентов при импорте',
    description:
      'При загрузке из Excel создаются повторные карточки с тем же ИНН.',
    status: 'resolved',
    createdAt: iso(5),
    updatedAt: iso(3),
  },
  {
    id: 'apl-004',
    title: 'Печать счёта: неверная печать',
    description: 'В шаблоне не подтягивается банковский счёт по умолчанию.',
    status: 'closed',
    createdAt: iso(14),
    updatedAt: iso(10),
  },
  {
    id: 'apl-005',
    title: 'Медленное открытие карточки заказа',
    description: 'В пиковые часы форма открывается 8–12 секунд.',
    status: 'new',
    createdAt: iso(0),
    updatedAt: iso(0),
  },
  {
    id: 'apl-006',
    title: 'Согласование скидки по договору',
    description: 'Требуется согласовать фиксированную скидку 7% на квартал.',
    status: 'in_progress',
    createdAt: iso(3),
    updatedAt: iso(1),
  },
  {
    id: 'apl-007',
    title: 'Ошибка проводки документа',
    description: 'Документ «Реализация» не проводится: не хватает счёта учёта.',
    status: 'resolved',
    createdAt: iso(7),
    updatedAt: iso(4),
  },
  {
    id: 'apl-008',
    title: 'Настройка маршрута согласования',
    description: 'Добавить шаг согласования с директором филиала.',
    status: 'new',
    createdAt: iso(1),
    updatedAt: iso(1),
  },
  {
    id: 'apl-009',
    title: 'Экспорт реестра в Excel',
    description: 'Нужен выгрузка с фильтром по периоду и колонкой «Менеджер».',
    status: 'in_progress',
    createdAt: iso(4),
    updatedAt: iso(2),
  },
  {
    id: 'apl-010',
    title: 'Блокировка пользователя',
    description:
      'Учётная запись блокируется после трёх неверных попыток без таймера.',
    status: 'closed',
    createdAt: iso(30),
    updatedAt: iso(25),
  },
  {
    id: 'apl-011',
    title: 'Интеграция с CRM',
    description: 'Поле «Источник лида» не синхронизируется в обе стороны.',
    status: 'new',
    createdAt: iso(0),
    updatedAt: iso(0),
  },
  {
    id: 'apl-012',
    title: 'Отчёт по дебиторке',
    description: 'Суммы не сходятся с оборотно-сальдовой ведомостью.',
    status: 'resolved',
    createdAt: iso(9),
    updatedAt: iso(6),
  },
  {
    id: 'apl-013',
    title: 'Мобильное приложение: крэш при фото',
    description:
      'Приложение падает при прикреплении фото к обращению на Android 14.',
    status: 'in_progress',
    createdAt: iso(2),
    updatedAt: iso(0),
  },
  {
    id: 'apl-014',
    title: 'Резервное копирование',
    description: 'Уточнить расписание бэкапов и хранение на внешнем носителе.',
    status: 'closed',
    createdAt: iso(60),
    updatedAt: iso(55),
  },
  {
    id: 'apl-015',
    title: 'Новый шаблон договора',
    description: 'Добавить переменные для автоподстановки реквизитов сторон.',
    status: 'new',
    createdAt: iso(1),
    updatedAt: iso(1),
  },
  {
    id: 'apl-016',
    title: 'Права на справочник номенклатуры',
    description: 'Ограничить редактирование для роли «Кладовщик».',
    status: 'resolved',
    createdAt: iso(11),
    updatedAt: iso(8),
  },
];
