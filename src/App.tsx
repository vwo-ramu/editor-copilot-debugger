import { useState } from 'react';

import { Navbar, NavbarBrand } from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';
import { Button } from '@nextui-org/button';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Card, CardBody } from '@nextui-org/card';
import { ToastContainer } from 'react-toastify';

import vwoWhiteLogo from './assets/vwo-logo-white.svg';

import './App.css';
import FileUpload from './components/FileUpload';
import { LogData } from './types';
import PreviewLog from './components/PreviewLog';
import EmptyLog from './components/EmptyLog';
import PrettyLog from './components/PrettyLog';

function App() {
    const [selectedTab, setSelectedTab] = useState<string>('step1');
    const [logData, setLogData] = useState<LogData | null>(null);

    return (
        <>
            <Navbar shouldHideOnScroll>
                <NavbarBrand>
                    <Link href='/'>
                        <img src={vwoWhiteLogo} alt='VWO' className='h-4' />
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

            {/* scrollable app body wrapper */}
            <div className='flex w-full justify-center'>
                {/* centered content */}
                <div className='max-w-[1024px] p-8 flex w-full flex-col'>
                    <Tabs
                        aria-label='Debug steps'
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as any)}>
                        <Tab key='step1' title='CSV Upload'>
                            <Card>
                                <CardBody className='flex flex-col gap-8'>
                                    <FileUpload updateLogData={(data) => setLogData(data)} />
                                    {logData && <PreviewLog data={logData} />}
                                    <Button color='primary' disabled={!logData} onClick={() => setSelectedTab('step2')}>
                                        Debug
                                    </Button>
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key='step2' title='View Logs'>
                            <Card>
                                <CardBody>
                                    {!logData ? (
                                        <EmptyLog
                                            navigateToUpload={() => {
                                                setSelectedTab('step1');
                                            }}
                                        />
                                    ) : (
                                        <PrettyLog data={logData} />
                                    )}
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            </div>

            {/* Toast notifications */}
            <ToastContainer />
        </>
    );
}

export default App;
