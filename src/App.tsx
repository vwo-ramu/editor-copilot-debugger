import { Navbar, NavbarBrand } from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';

import vwoWhiteLogo from './assets/vwo-logo-white.svg';

import './App.css';

function App() {
    return (
        <>
            <Navbar shouldHideOnScroll>
                <NavbarBrand>
                    <Link href='/'>
                        <img src={vwoWhiteLogo} alt='VWO' className='h-8' />
                    </Link>
                    <h1 className='text-xl ml-4'>Editor Debugger</h1>
                </NavbarBrand>

                {/* <NavbarContent justify='end'>
                    <NavbarItem>
                        <Button as={Link} color='primary' href='#' variant='flat'>
                            Sign Up
                        </Button>
                    </NavbarItem>
                </NavbarContent> */}
            </Navbar>

            {/* scrollable app body */}
            <div className='p-8'>
                <h1 className='text-4xl font-bold'>
                    Welcome!
                </h1>
            </div>
        </>
    );
}

export default App;
