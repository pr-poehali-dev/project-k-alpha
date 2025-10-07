import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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

interface Player {
  name: string;
  ping: number;
  playtime: string;
}

const ServerControl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const server = location.state?.server as Server;

  const [serverStatus, setServerStatus] = useState(server?.status || 'online');
  const [consoleCommand, setConsoleCommand] = useState('');
  const [consoleLog, setConsoleLog] = useState<string[]>([
    '[Server] Starting Minecraft server...',
    '[Server] Loading world...',
    '[Server] Server started successfully!',
    '[Server] Ready for players'
  ]);

  const [installedPlugins, setInstalledPlugins] = useState([
    { name: 'EssentialsX', version: '2.20.1', enabled: true, description: 'Основные команды и функции' },
    { name: 'WorldEdit', version: '7.2.15', enabled: true, description: 'Редактор мира' },
    { name: 'LuckPerms', version: '5.4.102', enabled: true, description: 'Система прав' }
  ]);

  const [onlinePlayers] = useState<Player[]>([
    { name: 'Steve', ping: 45, playtime: '2ч 15м' },
    { name: 'Alex', ping: 32, playtime: '1ч 30м' },
    { name: 'Herobrine', ping: 67, playtime: '45м' }
  ]);

  if (!server) {
    navigate('/');
    return null;
  }

  const toggleServer = () => {
    if (serverStatus === 'online') {
      setServerStatus('offline');
      toast.success('Сервер остановлен');
    } else {
      setServerStatus('starting');
      toast.success('Сервер запускается...');
      setTimeout(() => {
        setServerStatus('online');
        toast.success('Сервер запущен!');
      }, 2000);
    }
  };

  const togglePlugin = (pluginName: string) => {
    setInstalledPlugins(prev => 
      prev.map(plugin => 
        plugin.name === pluginName 
          ? { ...plugin, enabled: !plugin.enabled }
          : plugin
      )
    );
    const plugin = installedPlugins.find(p => p.name === pluginName);
    if (plugin) {
      toast.success(`Плагин ${pluginName} ${plugin.enabled ? 'выключен' : 'включен'}`);
    }
  };

  const executeCommand = () => {
    if (!consoleCommand.trim()) return;
    
    const newLog = [...consoleLog];
    newLog.push(`> ${consoleCommand}`);
    
    if (consoleCommand === 'help') {
      newLog.push('[Server] Available commands: stop, list, say, tp, gamemode');
    } else if (consoleCommand === 'list') {
      newLog.push(`[Server] Online players: ${onlinePlayers.length}/${server.maxPlayers}`);
    } else if (consoleCommand.startsWith('say ')) {
      const message = consoleCommand.substring(4);
      newLog.push(`[Server] Broadcast: ${message}`);
    } else {
      newLog.push('[Server] Command executed');
    }
    
    setConsoleLog(newLog);
    setConsoleCommand('');
  };

  const copyIpAddress = () => {
    navigator.clipboard.writeText(server.ip);
    toast.success('IP адрес скопирован!');
  };

  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'starting': return 'bg-yellow-500';
    }
  };

  const getStatusText = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'Онлайн';
      case 'offline': return 'Оффлайн';
      case 'starting': return 'Запуск...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="pixel-corners mb-4"
          >
            <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Назад к серверам
          </Button>

          <Card className="pixel-corners minecraft-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="font-pixel text-2xl">{server.name}</CardTitle>
                    <Badge className={`${getStatusColor(serverStatus)} pixel-corners`}>
                      {getStatusText(serverStatus)}
                    </Badge>
                  </div>
                  <CardDescription>
                    Версия {server.version} • {server.build} • {server.plan}
                  </CardDescription>
                </div>
                <Button
                  size="lg"
                  variant={serverStatus === 'online' ? 'destructive' : 'default'}
                  className="pixel-corners minecraft-shadow"
                  onClick={toggleServer}
                  disabled={serverStatus === 'starting'}
                >
                  <Icon name={serverStatus === 'online' ? 'PowerOff' : 'Power'} className="mr-2 h-5 w-5" />
                  {serverStatus === 'online' ? 'Остановить' : 'Запустить'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg pixel-corners">
                  <p className="text-xs text-muted-foreground mb-1">IP адрес сервера:</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-semibold">{server.ip}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={copyIpAddress}
                    >
                      <Icon name="Copy" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg pixel-corners">
                  <p className="text-xs text-muted-foreground mb-1">Игроки онлайн:</p>
                  <p className="font-pixel text-xl">{server.players}/{server.maxPlayers}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg pixel-corners">
                  <p className="text-xs text-muted-foreground mb-1">Нагрузка:</p>
                  <p className="font-pixel text-xl text-green-500">24% CPU</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="font-pixel text-xs md:text-sm">
              <Icon name="LayoutDashboard" className="mr-2 h-4 w-4" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="players" className="font-pixel text-xs md:text-sm">
              <Icon name="Users" className="mr-2 h-4 w-4" />
              Игроки
            </TabsTrigger>
            <TabsTrigger value="plugins" className="font-pixel text-xs md:text-sm">
              <Icon name="Puzzle" className="mr-2 h-4 w-4" />
              Плагины
            </TabsTrigger>
            <TabsTrigger value="console" className="font-pixel text-xs md:text-sm">
              <Icon name="Terminal" className="mr-2 h-4 w-4" />
              Консоль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4">
              <Card className="pixel-corners minecraft-shadow">
                <CardHeader>
                  <CardTitle className="font-pixel">📊 Статистика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Процессор</p>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '24%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">24%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Память (RAM)</p>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '68%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">2.7 GB / 4 GB</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Диск</p>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">11.2 GB / 25 GB</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Сеть</p>
                        <div className="flex items-center gap-2">
                          <Icon name="ArrowDown" className="h-3 w-3 text-green-500" />
                          <span className="text-xs">12.5 MB/s</span>
                          <Icon name="ArrowUp" className="h-3 w-3 text-blue-500" />
                          <span className="text-xs">8.2 MB/s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="pixel-corners minecraft-shadow">
                <CardHeader>
                  <CardTitle className="font-pixel">⚙️ Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="pixel-corners h-20 flex-col">
                      <Icon name="RefreshCw" className="h-6 w-6 mb-2" />
                      <span className="text-xs">Перезапуск</span>
                    </Button>
                    <Button variant="outline" className="pixel-corners h-20 flex-col">
                      <Icon name="Download" className="h-6 w-6 mb-2" />
                      <span className="text-xs">Бэкап</span>
                    </Button>
                    <Button variant="outline" className="pixel-corners h-20 flex-col">
                      <Icon name="Settings" className="h-6 w-6 mb-2" />
                      <span className="text-xs">Настройки</span>
                    </Button>
                    <Button variant="outline" className="pixel-corners h-20 flex-col">
                      <Icon name="Folder" className="h-6 w-6 mb-2" />
                      <span className="text-xs">Файлы</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="players">
            <Card className="pixel-corners minecraft-shadow">
              <CardHeader>
                <CardTitle className="font-pixel">👥 Игроки онлайн ({onlinePlayers.length})</CardTitle>
                <CardDescription>Управление игроками, донатами и правами</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {onlinePlayers.map((player, index) => (
                      <Card key={index} className="pixel-corners bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/20 rounded pixel-corners flex items-center justify-center">
                                <Icon name="User" className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-pixel text-sm">{player.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Пинг: {player.ping}мс • Время: {player.playtime}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="pixel-corners text-xs"
                                onClick={() => toast.success(`Донат выдан игроку ${player.name}`)}
                              >
                                <Icon name="Gift" className="h-3 w-3 mr-1" />
                                Выдать донат
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="pixel-corners text-xs"
                                onClick={() => toast.success(`OP выдан игроку ${player.name}`)}
                              >
                                <Icon name="Crown" className="h-3 w-3 mr-1" />
                                Выдать OP
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="pixel-corners text-xs"
                                onClick={() => toast.success(`Игрок ${player.name} забанен`)}
                              >
                                <Icon name="Ban" className="h-3 w-3 mr-1" />
                                Бан
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="pixel-corners text-xs"
                                onClick={() => toast.success(`Игрок ${player.name} разбанен`)}
                              >
                                <Icon name="Check" className="h-3 w-3 mr-1" />
                                Разбан
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plugins">
            <Card className="pixel-corners minecraft-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-pixel">🧩 Установленные плагины ({installedPlugins.length})</CardTitle>
                    <CardDescription>Управление плагинами и сборками сервера</CardDescription>
                  </div>
                  <Button 
                    className="pixel-corners minecraft-shadow"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.jar,.zip';
                      input.onchange = (e: any) => {
                        const file = e.target.files[0];
                        if (file) {
                          toast.success(`Сборка ${file.name} загружается...`);
                          setTimeout(() => toast.success('Сборка успешно загружена!'), 1500);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Icon name="Upload" className="h-4 w-4 mr-2" />
                    Загрузить сборку
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {installedPlugins.map((plugin, index) => (
                      <Card key={index} className="pixel-corners bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-pixel text-sm">{plugin.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  v{plugin.version}
                                </Badge>
                                <Badge 
                                  variant={plugin.enabled ? "default" : "secondary"} 
                                  className="text-xs"
                                >
                                  {plugin.enabled ? 'Вкл.' : 'Выкл.'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {plugin.description}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant={plugin.enabled ? "default" : "outline"}
                                className="pixel-corners text-xs"
                                onClick={() => togglePlugin(plugin.name)}
                              >
                                <Icon name={plugin.enabled ? "Power" : "PowerOff"} className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="pixel-corners text-xs">
                                <Icon name="Settings" className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive" className="pixel-corners text-xs">
                                <Icon name="Trash2" className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="console">
            <Card className="pixel-corners minecraft-shadow">
              <CardHeader>
                <CardTitle className="font-pixel">💻 Консоль сервера</CardTitle>
                <CardDescription>Выполнение команд и просмотр логов</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] bg-black/90 rounded-lg p-4 mb-4 font-mono text-sm">
                  <div className="space-y-1">
                    {consoleLog.map((log, index) => (
                      <div key={index} className="text-green-400">{log}</div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите команду..."
                    value={consoleCommand}
                    onChange={(e) => setConsoleCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                    className="pixel-corners font-mono"
                  />
                  <Button 
                    onClick={executeCommand}
                    className="pixel-corners minecraft-shadow"
                  >
                    <Icon name="Send" className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServerControl;