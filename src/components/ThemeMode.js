import './ThemeMode.css'
import LightModeIcon from '../imgs/light-mode-icon.png'
import DarkModeIcon from '../imgs/dark-mode-icon.png'


function ThemeMode(props) {
    return (
        <>
        <button className="theme-mode-button" onClick={props.onChangeColor}>
            {!props.toggleLight ? (
                <img className="light-mode-icon" src={LightModeIcon}></img>
            ):(
                <>
                    <img className="dark-mode-icon" src={DarkModeIcon}></img>
                </>
            )}
        </button>     
        {!props.toggleLight && <div className='background-dark-theme'></div>}
        </>
    )
}

export default ThemeMode;