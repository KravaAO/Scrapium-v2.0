import React, { useEffect, useState, useLayoutEffect  } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateTabState } from '../../store/tabSlice';
import { RootState } from '../../store';
import Switch from "react-switch";

import { DataPreview } from '../DataPreview/DataPreview';

import './ParsingWorkspace.scss';

import ArrowBackIcon from '../../assets/icons/arrow-back-icon.svg?react';
import ArrowNextIcon from '../../assets/icons/arrow-next-icon.svg?react';
import ReloadIcon from '../../assets/icons/reload-icon.svg?react';


export const ParsingWorkspace = () => {
  const [preloadPath, setPreloadPath] = useState<string | null>(null);
  const [parsingData, setParsingData] = useState<any[]>([]);
  
  const { state } = useLocation();
  const dispatch = useDispatch();

  const taskKey = state?.key;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (taskKey) {
        try {
          const parserData = await window.API.getParserData(taskKey);

          setParsingData(parserData);
        } catch (error) {
          console.error("Error fetching parser data:", error);
        }
      }
    };

    fetchInitialData();
  }, [taskKey]);

  
  useEffect(() => {
    const setTaskKey = async () => {
      if (taskKey) {
        await window.API.setCurrentTaskKey(taskKey);
      }
    };
    setTaskKey();
  }, [taskKey]);

  const tab = useSelector((state: RootState) =>
    state.tabs.tabs.find((tab) => tab.task.key === taskKey)
  );

  useEffect(() => {
    const fetchPreloadPath = async () => {
      try {
        setPreloadPath(await window.API.getPreloadPath());
      } catch (error) {
        return error;
      }
    };

    fetchPreloadPath();
  }, []);

  useLayoutEffect(() => {
    const webview = document.getElementById("my-webview") as HTMLWebViewElement;
    if (webview) {
      const onDomReady = () => {
        //@ts-ignore
        webview.send("taskKey", taskKey);
        console.log("WebView is ready");
        // @ts-ignore
        webview.executeJavaScript(`
          const matchedElements = []; // Масив для збереження селекторів
          let taskKey = null;
        
          // Отримання taskKey
          window.addEventListener('message', (event) => {
            if (event.data.taskKey) {
              taskKey = event.data.taskKey;
              console.log('Task Key:', taskKey);
            }
          });
        
          // Функція для генерації селектора
          function generateSelector(el) {
            let selector = el.tagName.toLowerCase();
            if (el.id) selector += '#' + el.id;
            if (el.classList.length > 0) selector += '.' + Array.from(el.classList).join('.');
            return selector;
          }
        
          // Обробка кліку
          document.addEventListener('click', (event) => {
            event.preventDefault();
            const element = event.target;
            const selector = generateSelector(element);
        
            if (!matchedElements.includes(selector)) {
              matchedElements.push(selector);
              element.style.border = '2px solid green'; // Підсвічуємо елемент
              window.API.postSelectors(selector); // Надсилаємо селектор
            } else {
              matchedElements.splice(matchedElements.indexOf(selector), 1);
              element.style.border = ''; // Забираємо підсвічення
              window.API.postSelectors(selector); // Можливо, видаляємо селектор на сервері
            }
        
            console.log('Selected Elements:', matchedElements);
          });
        `)
          .then(() => console.log("JavaScript executed"))
          .catch(() => console.error("Error executing JavaScript"));
      };

      webview.addEventListener("new-window", (event) => {
        //@ts-ignore
        event.preventDefault();
      });

      webview.addEventListener("will-navigate", () => {
        //@ts-ignore
        webview.loadURL(webview.src);
      });
      
      webview.addEventListener("dom-ready", onDomReady);
      return () => webview.removeEventListener("dom-ready", onDomReady);
    } else {
      return;
    }
  }, [preloadPath]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTabState({ key: taskKey, inputValue: event.target.value, switchValue: tab?.switchValue || false }));
  };

  const handleSwitchChange = (checked: boolean) => {
    dispatch(updateTabState({ key: taskKey, inputValue: tab?.inputValue || "", switchValue: checked }));
  };

  const startParser = async (key: string) => {
    try {
      const result = await window.API.startParser(key);

      setParsingData(result);
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="parser-workplace">
      {!tab ? (
        <div>Tab not found</div>
      ) : (
        <>
          <div className="parser-workplace__header">
            <p className="parser-workplace__title">{tab.task.data.title}</p>

            <div className="parser-workplace__navigation">
              <div className="parser-workplace__navigation-buttons">
                <ArrowBackIcon className="icon icon--medium" />
                <ArrowNextIcon className="icon icon--medium" />
                <ReloadIcon className="icon icon--medium" />
              </div>

              <form className="parser-workplace__form">
                <input
                  type="text"
                  className="input-search"
                  placeholder="Enter URL"
                  value={tab.inputValue || ""}
                  onChange={handleInputChange}
                />

                <Switch
                  onChange={handleSwitchChange}
                  checked={tab.switchValue || false}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  handleDiameter={12}
                  height={20}
                  width={38}
                  offColor={"#898989"}
                  onColor={"#1591EA"}
                />
              </form>
            </div>

            <button className="parser-workplace__button button" onClick={() => startParser(taskKey)}>RUN</button>
          </div>

          {preloadPath ? (
            <webview
              id="my-webview"
              src={tab.task.data.url}
              className="parser-workplace__browser"
              preload={preloadPath}
            ></webview>
          ) : (
            <div>Loading WebView...</div>
          )}

          <div className="parser-workplace__preview">
            <DataPreview data={parsingData}/>
          </div>

          <div className="parser-workplace__setup"></div>
        </>
      )}
    </div>
  );
};