import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth, useFetch } from '@/hooks';
import { eventService, toApiError } from '@/services';
import { EventDetailTemplate } from '@/components/templates';
import { useFormModal } from '@/components/organisms';
import type { Event as EventType } from '@/types';

export function EventDetailPage() {
  const params = useParams<{ id?: string }>();
  const id = params.id ?? '';
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openEditEvent, dataRefreshed } = useFormModal();

  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useFetch<EventType>(() => eventService.getEventById(id), [id]);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (dataRefreshed > 0) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRefreshed]);

  const handleDelete = async () => {
    if (!event) return;

    const eventId = event.id;
    if (!eventId) return;

    setDeleting(true);
    try {
      await eventService.deleteEvent(eventId);
      toast.success('Evento eliminado');
      navigate('/events');
    } catch (err) {
      toast.error(toApiError(err).message);
      setDeleting(false);
    }
  };

  return (
    <EventDetailTemplate
      event={event}
      isLoading={isLoading}
      error={error}
      canEdit={user?.role === 'admin'}
      deleting={deleting}
      onBack={() => navigate(-1)}
      onEdit={() => event && openEditEvent(event)}
      onDelete={handleDelete}
    />
  );
}
