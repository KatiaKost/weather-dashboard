import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';

interface EmptyStateProps {
  type: 'initial' | 'search';
}

export const EmptyState = ({ type }: EmptyStateProps) => {
  const t = useTranslation();

  const messages = {
    initial: t.descriptions.enterCity,
    search: 'Нажмите Enter или выберите город из списка для поиска погоды'
  };

  return (
    <Card className="p-6">
      <div className="text-center text-gray-500 py-8">
        {messages[type]}
      </div>
    </Card>
  );
};

export default EmptyState;