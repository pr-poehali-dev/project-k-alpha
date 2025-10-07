import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Tariff {
  id: string;
  name: string;
  price: number;
  diskSpace: number;
  ram: number;
  cpuPercent: number;
  maxPlayers: number;
  features: string[];
  badge?: string;
  highlight?: boolean;
}

const Payment = () => {
  const navigate = useNavigate();
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  const [playerNickname, setPlayerNickname] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const tariffs: Tariff[] = [
    {
      id: 'free',
      name: 'Бесплатный',
      price: 0,
      diskSpace: 10,
      ram: 2,
      cpuPercent: 30,
      maxPlayers: 2999,
      features: ['До 2999 игроков', '2 GB RAM', '10 GB диск', 'DDoS защита', '24/7 онлайн'],
      badge: '🎁 FREE',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 299,
      diskSpace: 25,
      ram: 4,
      cpuPercent: 50,
      maxPlayers: -1,
      features: ['Безлимит игроков', '4 GB RAM', '25 GB SSD', 'Приоритет поддержка', 'Автобэкапы 6ч', 'Свой домен'],
      badge: '🚀 ПОПУЛЯРНЫЙ',
      highlight: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 599,
      diskSpace: 50,
      ram: 8,
      cpuPercent: 70,
      maxPlayers: -1,
      features: ['Безлимит игроков', '8 GB RAM', '50 GB NVMe', 'VIP поддержка', 'Бэкапы 3ч', 'Выделенный IP'],
      badge: '🔥 VIP',
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: 999,
      diskSpace: 100,
      ram: 16,
      cpuPercent: 85,
      maxPlayers: -1,
      features: ['Безлимит игроков', '16 GB RAM', '100 GB NVMe', 'Персональная поддержка', 'Бэкапы каждый час', 'Выделенный сервер', 'Все дополнения'],
      badge: '⭐ VIP',
    },
    {
      id: 'all-or-nothing',
      name: 'ВСЁ или НИЧЕГО',
      price: 5999,
      diskSpace: 999,
      ram: 999,
      cpuPercent: 90,
      maxPlayers: 999,
      features: ['999 игроков одновременно', '999 GB RAM', '999 GB NVMe диск', '90% CPU мощности', 'Персональный менеджер', 'Бэкапы каждые 30 минут', 'Выделенный сервер с приоритетом', 'Все дополнения + кастомные настройки'],
      badge: '🔥 НОВЫЙ',
      highlight: true,
    },
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = (tariff: Tariff) => {
    if (!playerNickname.trim()) {
      toast.error('Введи свой игровой никнейм!');
      return;
    }

    if (tariff.price === 0) {
      toast.success('Бесплатный тариф уже активен!');
      return;
    }

    setIsProcessing(true);

    const widget = (window as any).cp?.CloudPayments;
    
    if (!widget) {
      toast.error('Ошибка загрузки платежного виджета');
      setIsProcessing(false);
      return;
    }

    const checkout = new widget();

    checkout.pay('charge', {
      publicId: 'DevelsKill3658',
      description: `Тариф "${tariff.name}" - MineCraft Host`,
      amount: tariff.price,
      currency: 'RUB',
      accountId: playerNickname,
      invoiceId: `${Date.now()}`,
      skin: 'mini',
      data: {
        tariffId: tariff.id,
        tariffName: tariff.name,
        playerNickname: playerNickname,
      },
    }, {
      onSuccess: function(options: any) {
        toast.success(`Оплата успешна! Тариф "${tariff.name}" активирован для ${playerNickname}`);
        setIsProcessing(false);
        setTimeout(() => navigate('/'), 2000);
      },
      onFail: function(reason: any, options: any) {
        toast.error(`Ошибка оплаты: ${reason}`);
        setIsProcessing(false);
      },
      onComplete: function(paymentResult: any, options: any) {
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="pixel-corners mb-4"
          >
            <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Назад
          </Button>

          <Card className="pixel-corners minecraft-shadow mb-6">
            <CardHeader>
              <CardTitle className="font-pixel text-2xl">💳 Оплата тарифа</CardTitle>
              <CardDescription>
                Выбери тариф и оплати через CloudPayments (банковские карты, СБП, электронные кошельки)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Игровой никнейм</label>
                  <Input
                    placeholder="Например: Steve"
                    value={playerNickname}
                    onChange={(e) => setPlayerNickname(e.target.value)}
                    className="pixel-corners"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    На этот никнейм будет выдан тариф и бонусы
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tariffs.map((tariff) => (
            <Card 
              key={tariff.id}
              className={`pixel-corners minecraft-shadow relative overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                tariff.highlight ? 'border-4 border-primary' : 'border-2 border-muted'
              } ${selectedTariff?.id === tariff.id ? 'ring-4 ring-primary' : ''}`}
              onClick={() => setSelectedTariff(tariff)}
            >
              {tariff.badge && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-pixel">
                  {tariff.badge}
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="font-pixel text-lg">{tariff.name}</CardTitle>
                <CardDescription className="text-2xl font-bold mt-2">
                  {tariff.price === 0 ? 'Бесплатно' : `${tariff.price} ₽/мес`}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2 text-xs">
                  {tariff.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Icon name="Check" className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full pixel-corners minecraft-shadow text-xs"
                  variant={selectedTariff?.id === tariff.id ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePayment(tariff);
                  }}
                  disabled={isProcessing || tariff.price === 0}
                >
                  {tariff.price === 0 ? 'Активен' : 'Оплатить'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="pixel-corners minecraft-shadow mt-8">
          <CardHeader>
            <CardTitle className="font-pixel">ℹ️ Информация об оплате</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Icon name="Shield" className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Безопасная оплата</p>
                <p className="text-muted-foreground text-xs">Платежи обрабатываются через CloudPayments - сертифицированный PCI DSS провайдер</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CreditCard" className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Способы оплаты</p>
                <p className="text-muted-foreground text-xs">Visa, MasterCard, МИР, СБП, Apple Pay, Google Pay, Яндекс.Pay</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Clock" className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Мгновенная активация</p>
                <p className="text-muted-foreground text-xs">Тариф активируется автоматически сразу после успешной оплаты</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="RefreshCw" className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Возврат средств</p>
                <p className="text-muted-foreground text-xs">В течение 14 дней можно вернуть деньги, если не устроил сервис</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>При возникновении проблем с оплатой, свяжись с поддержкой</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
