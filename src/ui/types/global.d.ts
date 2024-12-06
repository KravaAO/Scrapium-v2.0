declare global {
  interface Window {
    API: {
      closeWindow: () => void;
      maximizeWindow: () => void;
      minimizeWindow: () => void;
      createTask: (data: data) => Promise<any>;
      deleteTask: (key: string) => Promise<any>;
      getTask: (key: string) => any;
      getAllTask: () => Promise<any>;
      getPreloadPath: () => string | null;
      getParserData: (key: string) => Promise<any>;
      getWebContents(): Electron.WebContents;
      startParser: (key: string) => Promise<any>;
      setCurrentTaskKey: (key: string) => Promise<any>;
    };
  }

  type WindowControlEventHandler = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  export interface RootState {
    user: {
      nickName: string;
      token: string;
      id: number;
    };
  }

  interface Task {
    key: string;
    data: {
      title: string;
      url: string;
    };
  }
  
  interface TabItemProps {
    task: Task;
    isActive: boolean;
  }
}

export {};