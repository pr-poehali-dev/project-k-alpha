import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Server {
  id: string;
  name: string;
  version: string;
  status: 'online' | 'offline' | 'starting';
  players: number;
  maxPlayers: number;
  plan: string;
}

const Index = () => {
  const [servers, setServers] = useState<Server[]>([
    {
      id: '1',
      name: 'Мой сервер выживания',
      version: '1.20.4',
      status: 'online',
      players: 3,
      maxPlayers: 20,
      plan: 'Бесплатный'
    }
  ]);

  const [serverName, setServerName] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('1.20.4');

  const createServer = () => {
    if (!serverName.trim()) {
      toast.error('Укажи название сервера!');
      return;
    }

    const newServer: Server = {
      id: Date.now().toString(),
      name: serverName,
      version: selectedVersion,
      status: 'starting',
      players: 0,
      maxPlayers: 20,
      plan: 'Бесплатный'
    };

    setServers([...servers, newServer]);
    toast.success(`Сервер "${serverName}" создаётся!`);
    setServerName('');

    setTimeout(() => {
      setServers(prev => 
        prev.map(s => s.id === newServer.id ? { ...s, status: 'online' as const } : s)
      );
    }, 3000);
  };

  const deleteServer = (id: string) => {
    setServers(servers.filter(s => s.id !== id));
    toast.success('Сервер удалён');
  };

  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'bg-primary text-primary-foreground';
      case 'offline': return 'bg-destructive text-destructive-foreground';
      case 'starting': return 'bg-accent text-accent-foreground';
    }
  };

  const getStatusText = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'Работает';
      case 'offline': return 'Остановлен';
      case 'starting': return 'Запускается';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-6xl animate-float">🧱</div>
            <h1 className="text-4xl md:text-6xl font-pixel text-primary mb-2">
              MineCraft Host
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Создай свой Minecraft сервер за одну секунду и играй с друзьями без настройки!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="pixel-corners minecraft-shadow hover:shadow-lg transition-all">
            <CardHeader>
              <div className="text-4xl mb-2">⚡</div>
              <CardTitle className="font-pixel text-lg">Мгновенный запуск</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Создание сервера в один клик без сложной настройки
              </p>
            </CardContent>
          </Card>

          <Card className="pixel-corners minecraft-shadow hover:shadow-lg transition-all">
            <CardHeader>
              <div className="text-4xl mb-2">🎁</div>
              <CardTitle className="font-pixel text-lg">Бесплатный тариф</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Начни играть бесплатно, апгрейд в любой момент
              </p>
            </CardContent>
          </Card>

          <Card className="pixel-corners minecraft-shadow hover:shadow-lg transition-all">
            <CardHeader>
              <div className="text-4xl mb-2">🛡️</div>
              <CardTitle className="font-pixel text-lg">Защита 24/7</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Защита от DDoS атак и техподдержка круглосуточно
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="create" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create" className="font-pixel text-xs md:text-sm">
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Создать сервер
            </TabsTrigger>
            <TabsTrigger value="servers" className="font-pixel text-xs md:text-sm">
              <Icon name="Server" className="mr-2 h-4 w-4" />
              Мои серверы ({servers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="pixel-corners minecraft-shadow">
              <CardHeader>
                <CardTitle className="font-pixel text-xl">Новый сервер</CardTitle>
                <CardDescription>
                  Заполни данные и сервер будет готов через несколько секунд
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Название сервера</label>
                  <Input
                    placeholder="Например: Сервер выживания"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="pixel-corners"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Версия Minecraft</label>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger className="pixel-corners">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.20.4">1.20.4 (последняя)</SelectItem>
                      <SelectItem value="1.20.1">1.20.1</SelectItem>
                      <SelectItem value="1.19.4">1.19.4</SelectItem>
                      <SelectItem value="1.18.2">1.18.2</SelectItem>
                      <SelectItem value="1.16.5">1.16.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-4 rounded-lg pixel-corners">
                  <h3 className="font-pixel text-xs mb-3">Бесплатный тариф включает:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                      <span>До 20 игроков одновременно</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                      <span>2 ГБ оперативной памяти</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                      <span>Защита от DDoS атак</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                      <span>Автоматические бэкапы</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={createServer} 
                  size="lg" 
                  className="w-full font-pixel pixel-corners minecraft-shadow hover:scale-105 transition-transform"
                >
                  <Icon name="Rocket" className="mr-2 h-5 w-5" />
                  Создать сервер
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers">
            <div className="space-y-4">
              {servers.length === 0 ? (
                <Card className="pixel-corners minecraft-shadow">
                  <CardContent className="py-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-muted-foreground mb-4">У тебя пока нет серверов</p>
                    <Button variant="outline" className="pixel-corners">
                      Создать первый сервер
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                servers.map((server) => (
                  <Card key={server.id} className="pixel-corners minecraft-shadow hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="font-pixel text-lg">{server.name}</CardTitle>
                            <Badge className={`${getStatusColor(server.status)} pixel-corners text-xs`}>
                              {getStatusText(server.status)}
                            </Badge>
                          </div>
                          <CardDescription>Версия {server.version} • {server.plan}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Users" className="h-4 w-4 text-primary" />
                          <span>{server.players}/{server.maxPlayers} игроков</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {server.status === 'online' && (
                          <>
                            <Button variant="outline" size="sm" className="pixel-corners flex-1">
                              <Icon name="Copy" className="mr-2 h-4 w-4" />
                              IP адрес
                            </Button>
                            <Button variant="outline" size="sm" className="pixel-corners flex-1">
                              <Icon name="Settings" className="mr-2 h-4 w-4" />
                              Настройки
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="pixel-corners"
                          onClick={() => deleteServer(server.id)}
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>MineCraft Host • Создавай серверы и играй с друзьями 🎮</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
