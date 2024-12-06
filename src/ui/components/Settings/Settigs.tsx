import './Settings.scss';

export const Settings = () => (
  <div className="settings">
    <ul className="settings__list">
      <li className="settings__item">
        <div className="settings__item-header">
          <h1 className="settings__title title--h1">Settings</h1>
          <p className="settings__description p-gray">In this section, you can customize your app settings to suit your individual needs.</p>
        </div>
      </li>

      <li className="settings__item">
        <div className="settings__item-header">
          <h2 className="settings__title title--h2">Interface</h2>
          <p className="settings__description p-gray">In this section, you can customize the appearance of the application interface to make it convenient and pleasant to use.</p>
        </div>

        <div className="settings__item-content">
          <div className="settings__number-group">
            <p className="settings__paragraph paragraph--h3">Size of interface:</p>
            <div className="settings__color-group">
              <label htmlFor="interface-size" className="settings__label">Size of interface:</label>
              <input className="settings__input settings__input--number" type="number" id="interface-size" min={10} />
            </div>
          </div>

          <div className='settings__color-section'>
            <p className="settings__paragraph paragraph--h3">Interface colors:</p>
            <div className="settings__color-group">
              <label className="settings__color-label">Main color:</label>
              <input className="settings__input--color" id="main-color" type="color" defaultValue="#1d1d1d" />
            </div>

            <div className="settings__color-group">
              <label className="settings__color-label">Secondary color:</label>
              <input className="settings__input--color" id="secondary-color" type="color" defaultValue='#F3F3F3' />
            </div>

            <div className="settings__color-group">
              <label className="settings__color-label">Text color:</label>
              <input className="settings__input--color" id="text-color" type="color" defaultValue="#000000" />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
);
