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
                    </SelectContent>
                  </Select>
                </div>

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