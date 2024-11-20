import NavBar from './Components/navbar/navBar'
import Initial from './Components/initial/initial';
import AboutUs from './Components/aboutUs/aboutUs';
import Boxes from './Components/boxes/boxes';
import Plans from './Components/plans/plans';
import Feedback from './Components/feedback/feedback';
import Footer from './Components/footer/footer';

const App =(props) => {
  return (
    <div>
        <NavBar />
        <main>
          <Initial />
          <AboutUs />
          <Boxes />
          <Plans />
          <Feedback />
          <Footer />
        </main>
        
    </div>
  );
}

export default App;
