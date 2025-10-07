import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ip: string;
  build: string;
}

const Index = () => {
  const [servers, setServers] = useState<Server[]>([
    {
      id: '1',
      name: 'Мой сервер выживания',
      version: '1.20.4',
      status: 'online',
      players: 3,
      maxPlayers: 2999,
      plan: 'Бесплатный',
      ip: 'mc.server-1.ru:25565',
      build: 'Vanilla'
    }
  ]);

  const [serverName, setServerName] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('1.20.4');
  const [selectedBuild, setSelectedBuild] = useState('Vanilla');
  const [customBuildUrl, setCustomBuildUrl] = useState('');
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [currentServerId, setCurrentServerId] = useState<string | null>(null);
  const [consoleCommand, setConsoleCommand] = useState('');
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '[Server] Starting Minecraft server...',
    '[Server] Loading world...',
    '[Server] Server started successfully!',
    '[Server] Ready for players on port 25565'
  ]);
  const [currentPath, setCurrentPath] = useState('/');
  const [files] = useState([
    { name: 'server.properties', type: 'file', size: '2.4 KB', modified: '10 мин назад' },
    { name: 'world', type: 'folder', size: '—', modified: '1 час назад' },
    { name: 'plugins', type: 'folder', size: '—', modified: '2 часа назад' },
    { name: 'logs', type: 'folder', size: '—', modified: '5 мин назад' },
    { name: 'ops.json', type: 'file', size: '128 B', modified: '3 часа назад' },
    { name: 'whitelist.json', type: 'file', size: '64 B', modified: '3 часа назад' },
    { name: 'banned-players.json', type: 'file', size: '32 B', modified: '1 день назад' },
  ]);

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
      maxPlayers: 2999,
      plan: 'Бесплатный',
      ip: `mc.server-${Date.now()}.ru:25565`,
      build: selectedBuild
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

  const copyIpAddress = (ip: string) => {
    navigator.clipboard.writeText(ip);
    toast.success('IP адрес скопирован!');
  };

  const openConsole = (serverId: string) => {
    setCurrentServerId(serverId);
    setConsoleOpen(true);
  };

  const openFiles = (serverId: string) => {
    setCurrentServerId(serverId);
    setFilesOpen(true);
    setCurrentPath('/');
  };

  const executeCommand = () => {
    if (!consoleCommand.trim()) return;
    
    const newLog = [...consoleLog];
    newLog.push(`> ${consoleCommand}`);
    
    if (consoleCommand === 'help') {
      newLog.push('[Server] Available commands: stop, list, say, tp, gamemode');
    } else if (consoleCommand === 'list') {
      newLog.push('[Server] Online players: 3/2999');
    } else if (consoleCommand.startsWith('say ')) {
      const message = consoleCommand.substring(4);
      newLog.push(`[Server] Broadcast: ${message}`);
    } else {
      newLog.push('[Server] Command executed');
    }
    
    setConsoleLog(newLog);
    setConsoleCommand('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
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
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="create" className="font-pixel text-xs md:text-sm">
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Создать
            </TabsTrigger>
            <TabsTrigger value="servers" className="font-pixel text-xs md:text-sm">
              <Icon name="Server" className="mr-2 h-4 w-4" />
              Серверы ({servers.length})
            </TabsTrigger>
            <TabsTrigger value="shop" className="font-pixel text-xs md:text-sm">
              <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="stats" className="font-pixel text-xs md:text-sm">
              <Icon name="BarChart3" className="mr-2 h-4 w-4" />
              Статистика
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Сборка сервера</label>
                  <Select value={selectedBuild} onValueChange={setSelectedBuild}>
                    <SelectTrigger className="pixel-corners">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vanilla">Vanilla (чистый)</SelectItem>
                      <SelectItem value="Spigot">Spigot</SelectItem>
                      <SelectItem value="Paper">Paper</SelectItem>
                      <SelectItem value="Forge">Forge (моды)</SelectItem>
                      <SelectItem value="Fabric">Fabric (моды)</SelectItem>
                      <SelectItem value="Purpur">Purpur</SelectItem>
                      <SelectItem value="Custom">🔧 Своя сборка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedBuild === 'Custom' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-sm font-medium">Ссылка на .jar файл</label>
                    <Input
                      placeholder="https://example.com/server.jar"
                      value={customBuildUrl}
                      onChange={(e) => setCustomBuildUrl(e.target.value)}
                      className="pixel-corners font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      ⚠️ Укажи прямую ссылку на скачивание JAR-файла сервера
                    </p>
                  </div>
                )}

                <div className="bg-muted p-4 rounded-lg pixel-corners">
                  <h3 className="font-pixel text-xs mb-3">Бесплатный тариф включает:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                      <span>До 2999 игроков одновременно</span>
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
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                      <span>24/7 онлайн сервера</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                      <span>Доступ к консоли</span>
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
                          <CardDescription>Версия {server.version} • {server.build} • {server.plan}</CardDescription>
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
                      
                      {server.status === 'online' && (
                        <div className="bg-muted p-3 rounded-lg pixel-corners mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">IP адрес сервера:</p>
                              <p className="font-mono font-semibold">{server.ip}</p>
                            </div>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="pixel-corners minecraft-shadow"
                              onClick={() => copyIpAddress(server.ip)}
                            >
                              <Icon name="Copy" className="mr-2 h-4 w-4" />
                              Копировать
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {server.status === 'online' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="pixel-corners"
                              onClick={() => openConsole(server.id)}
                            >
                              <Icon name="Terminal" className="mr-2 h-4 w-4" />
                              Консоль
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="pixel-corners"
                              onClick={() => openFiles(server.id)}
                            >
                              <Icon name="Folder" className="mr-2 h-4 w-4" />
                              Файлы
                            </Button>
                            <Button variant="outline" size="sm" className="pixel-corners">
                              <Icon name="Settings" className="mr-2 h-4 w-4" />
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

          <TabsContent value="shop">
            <div className="space-y-6">
              <Card className="pixel-corners minecraft-shadow">
                <CardHeader>
                  <CardTitle className="font-pixel text-xl">🛒 Тарифы хостинга</CardTitle>
                  <CardDescription>
                    Выбери подходящий тариф для своего сервера
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="pixel-corners border-2 border-muted hover:border-primary transition-all">
                      <CardHeader>
                        <div className="text-4xl mb-2">🎁</div>
                        <CardTitle className="font-pixel text-lg">Бесплатный</CardTitle>
                        <CardDescription className="text-2xl font-bold mt-2">0 ₽/мес</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>До 2999 игроков</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>2 GB RAM</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>10 GB диск</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>DDoS защита</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>24/7 онлайн</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full pixel-corners mt-4" disabled>
                          Текущий план
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="pixel-corners border-2 border-primary minecraft-shadow relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-pixel">
                        ПОПУЛЯРНЮ
                      </div>
                      <CardHeader>
                        <div className="text-4xl mb-2">🚀</div>
                        <CardTitle className="font-pixel text-lg">Pro</CardTitle>
                        <CardDescription className="text-2xl font-bold mt-2">299 ₽/мес</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>Безлимит игроков</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>4 GB RAM</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>25 GB SSD диск</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>Приоритет поддержка</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>Автобэкапы каждые 6ч</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>Свой домен</span>
                          </div>
                        </div>
                        <Button className="w-full pixel-corners minecraft-shadow mt-4">
                          Перейти на Pro
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="pixel-corners border-2 border-accent hover:border-accent/70 transition-all">
                      <CardHeader>
                        <div className="text-4xl mb-2">🔥</div>
                        <CardTitle className="font-pixel text-lg">Premium</CardTitle>
                        <CardDescription className="text-2xl font-bold mt-2">599 ₽/мес</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>Безлимит игроков</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>8 GB RAM</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>50 GB NVMe диск</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>VIP поддержка</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>Бэкапы каждые 3ч</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Check" className="h-4 w-4 text-primary mt-0.5" />
                            <span>Выделенный IP</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full pixel-corners mt-4">
                          Перейти на Premium
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card className="pixel-corners minecraft-shadow">
                <CardHeader>
                  <CardTitle className="font-pixel text-xl">📦 Дополнения</CardTitle>
                  <CardDescription>
                    Улучши свой сервер дополнительными функциями
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="pixel-corners bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-2xl">🛡️</div>
                              <h3 className="font-pixel text-sm">Anti-DDoS Pro</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              Усиленная защита от атак
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">99 ₽/мес</span>
                              <Button size="sm" variant="outline" className="pixel-corners text-xs">
                                Купить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="pixel-corners bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-2xl">💾</div>
                              <h3 className="font-pixel text-sm">Доп. хранилище</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              +25 GB дискового пространства
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">49 ₽/мес</span>
                              <Button size="sm" variant="outline" className="pixel-corners text-xs">
                                Купить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="pixel-corners bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-2xl">🌐</div>
                              <h3 className="font-pixel text-sm">Свой домен</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              play.yourdomain.ru
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">149 ₽/мес</span>
                              <Button size="sm" variant="outline" className="pixel-corners text-xs">
                                Купить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="pixel-corners bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-2xl">⚡</div>
                              <h3 className="font-pixel text-sm">Ускорение CPU</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              +50% производительности
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">199 ₽/мес</span>
                              <Button size="sm" variant="outline" className="pixel-corners text-xs">
                                Купить
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              <Card className="pixel-corners minecraft-shadow">
                <CardHeader>
                  <CardTitle className="font-pixel text-xl">Статистика сервера</CardTitle>
                  <CardDescription>
                    Мониторинг ресурсов и онлайна в реальном времени
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="pixel-corners bg-muted/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Процессор</CardTitle>
                          <Icon name="Cpu" className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold font-pixel">24%</div>
                        <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '24%' }}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="pixel-corners bg-muted/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Оперативная память</CardTitle>
                          <Icon name="MemoryStick" className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold font-pixel">1.2/2 GB</div>
                        <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: '60%' }}></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="pixel-corners bg-muted/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Онлайн игроков</CardTitle>
                          <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold font-pixel">3/2999</div>
                        <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '0.1%' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="pixel-corners bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">График онлайна (24 часа)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-end justify-between gap-1">
                        {[2, 5, 3, 7, 4, 8, 6, 9, 5, 12, 8, 15, 10, 13, 9, 11, 7, 5, 3, 6, 4, 2, 3, 1].map((value, index) => (
                          <div 
                            key={index}
                            className="flex-1 bg-primary rounded-t pixel-corners hover:bg-primary/80 transition-all cursor-pointer"
                            style={{ height: `${(value / 15) * 100}%` }}
                            title={`${value} игроков`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="pixel-corners bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Icon name="Activity" className="h-4 w-4" />
                          Активность
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Время работы:</span>
                          <span className="font-semibold">24 часа 12 мин</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Последний рестарт:</span>
                          <span className="font-semibold">Вчера, 15:30</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">TPS:</span>
                          <span className="font-semibold text-primary">20.0</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="pixel-corners bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Icon name="HardDrive" className="h-4 w-4" />
                          Хранилище
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Использовано:</span>
                          <span className="font-semibold">3.2 GB / 10 GB</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: '32%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Свободно: 6.8 GB</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>MineCraft Host • Создавай серверы и играй с друзьями 🎮</p>
        </footer>
      </div>

      <Dialog open={consoleOpen} onOpenChange={setConsoleOpen}>
        <DialogContent className="max-w-3xl pixel-corners">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xl flex items-center gap-2">
              <Icon name="Terminal" className="h-5 w-5" />
              Консоль сервера
            </DialogTitle>
            <DialogDescription>
              Управляй сервером через командную строку
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <ScrollArea className="h-[400px] w-full rounded-lg border bg-black p-4">
              <div className="font-mono text-sm space-y-1">
                {consoleLog.map((line, index) => (
                  <div 
                    key={index} 
                    className={`${
                      line.startsWith('>')
                        ? 'text-primary font-semibold'
                        : line.includes('ERROR')
                        ? 'text-destructive'
                        : line.includes('SUCCESS') || line.includes('started')
                        ? 'text-primary'
                        : 'text-green-400'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                placeholder="Введи команду (например: list, help, say привет)..."
                value={consoleCommand}
                onChange={(e) => setConsoleCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-mono pixel-corners"
              />
              <Button 
                onClick={executeCommand}
                className="pixel-corners minecraft-shadow"
              >
                <Icon name="Send" className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-muted p-3 rounded-lg pixel-corners">
              <p className="text-xs text-muted-foreground mb-2 font-pixel">Популярные команды:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="pixel-corners text-xs"
                  onClick={() => setConsoleCommand('list')}
                >
                  list
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="pixel-corners text-xs"
                  onClick={() => setConsoleCommand('help')}
                >
                  help
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="pixel-corners text-xs"
                  onClick={() => setConsoleCommand('say Добро пожаловать!')}
                >
                  say
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={filesOpen} onOpenChange={setFilesOpen}>
        <DialogContent className="max-w-4xl pixel-corners">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xl flex items-center gap-2">
              <Icon name="Folder" className="h-5 w-5" />
              Файловый менеджер
            </DialogTitle>
            <DialogDescription>
              Управляй файлами и папками сервера
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg pixel-corners">
              <Icon name="HardDrive" className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm">{currentPath}</span>
            </div>

            <div className="border rounded-lg pixel-corners overflow-hidden">
              <div className="bg-muted p-3 grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground">
                <div className="col-span-6">Имя</div>
                <div className="col-span-2">Размер</div>
                <div className="col-span-3">Изменён</div>
                <div className="col-span-1">Действия</div>
              </div>
              
              <ScrollArea className="h-[400px]">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="p-3 grid grid-cols-12 gap-4 items-center hover:bg-muted/50 transition-colors border-b last:border-b-0"
                  >
                    <div className="col-span-6 flex items-center gap-2">
                      {file.type === 'folder' ? (
                        <Icon name="Folder" className="h-4 w-4 text-accent" />
                      ) : (
                        <Icon name="FileText" className="h-4 w-4 text-primary" />
                      )}
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {file.size}
                    </div>
                    <div className="col-span-3 text-sm text-muted-foreground">
                      {file.modified}
                    </div>
                    <div className="col-span-1 flex gap-1">
                      {file.type === 'file' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => toast.info(`Редактирование ${file.name}`)}
                          >
                            <Icon name="Pencil" className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => toast.info(`Загрузка ${file.name}`)}
                          >
                            <Icon name="Download" className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => toast.success(`${file.name} удалён`)}
                      >
                        <Icon name="Trash2" className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="flex gap-2">
              <Button className="pixel-corners minecraft-shadow flex-1">
                <Icon name="Upload" className="mr-2 h-4 w-4" />
                Загрузить файл
              </Button>
              <Button variant="outline" className="pixel-corners flex-1">
                <Icon name="FolderPlus" className="mr-2 h-4 w-4" />
                Создать папку
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;