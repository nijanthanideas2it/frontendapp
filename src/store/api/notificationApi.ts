import { apiSlice } from './apiSlice';
import type {
  NotificationsListResponse,
  MarkNotificationReadResponse,
  MarkAllNotificationsReadResponse,
  NotificationsQueryParams,
} from '../../types/api/notification';

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user notifications
    getNotifications: builder.query<NotificationsListResponse, NotificationsQueryParams>({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Notification' as const, id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    // Mark notification as read
    markNotificationRead: builder.mutation<MarkNotificationReadResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    // Mark all notifications as read
    markAllNotificationsRead: builder.mutation<MarkAllNotificationsReadResponse, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    // Get notification statistics (unread count, etc.)
    getNotificationStats: builder.query<{ unread_count: number; total_count: number }, void>({
      query: () => '/notifications/stats',
      providesTags: [{ type: 'Notification', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useGetNotificationStatsQuery,
} = notificationApi; 