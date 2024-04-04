import Details from './Components/Details';
import MainManage from './Components/MainManage';
import MainMap from './Components/Map';
import './index.scss';

function App() {
  return (
    <>
      <header>

      </header>
      <div className='mainPage'>
        <aside>
          <MainManage />
        </aside>
        <main>
          <MainMap />
          <Details/>
        </main>
      </div>
    </>
  );
}

export default App;
