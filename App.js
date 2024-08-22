import React, { useContext, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { MyDispatcherContext, MyUserContext } from './configs/Context';
import { MyUserReducer } from './configs/Reducers';
import Home from './components/User/Home';
import Login from './components/User/Login';
import Service from './components/Service';
import ServiceDetails from './components/ServiceDetails/ServiceDetails';
import Customer from './components/Customer/Customer';
import Cart from './components/Cart/Cart';
import Payment from './components/Payment';
import ServiceManagement from './components/ServiceManagement';
import Provider from './components/Provider';
import ScheduleList from './components/ScheduleList';
import RegistrationList from './components/RegistrationList';
import CreateSchedule from './components/CreateSchedule';
import CreateService from './components/CreateService/CreateService';
import ChatBox from './components/ChatBox/ChatBox';
import UserInfo from './components/UserInfo/UserInfo';
import Register from './components/User/Register';
import ChangePassword from './components/User/ChangePassword';
import ContactBookingInfo from './components/ContactBookingInfo';
import Booking from './components/Booking';
import Chat from './components/Chat/Chat';
import Messenger from './components/Messenger';
import ChatList from './components/Chat/ChatList';
import UpdateService from './components/UpdateService';

import {
    faHome,
    faRightToBracket,
    faArrowLeft,
    faUserPlus,
    faRectangleList,
    faUser,
    faPeopleGroup,
    faUsersRectangle,
    faChartLine,
    faClipboardList,
    faCommentDots,
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faHome,
    faRightToBracket,
    faArrowLeft,
    faUserPlus,
    faRectangleList,
    faUser,
    faPeopleGroup,
    faUsersRectangle,
    faChartLine,
    faClipboardList,
    faCommentDots,
);

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Service" component={Service} options={{ title: 'Service' }} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} options={{ title: 'ServiceDetails' }} />
        </Stack.Navigator>
    );
};

const MyStack01 = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Sign in" component={Login} options={{ title: 'Sign in' }} />
            <Stack.Screen name="Register" component={Register} options={{ title: 'Đăng ký' }} />
        </Stack.Navigator>
    );
};

const MyStack02 = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Service" component={Service} options={{ title: 'Service' }} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} options={{ title: 'ServiceDetails' }} />
            <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
            <Stack.Screen
                name="ContactBookingInfo"
                component={ContactBookingInfo}
                options={{ title: 'ContactBookingInfo' }}
            />
            <Stack.Screen name="Booking" component={Booking} options={{ title: 'Booking' }} />
            <Stack.Screen name="Payment" component={Payment} options={{ title: 'Payment' }} />
        </Stack.Navigator>
    );
};

const MyStack03 = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Customer" component={Customer} options={{ title: 'Customer' }} />
            <Stack.Screen name="UserInfo" component={UserInfo} options={{ title: 'UserInfo' }} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: 'ChangePassword' }} />
        </Stack.Navigator>
    );
};

const MyStack04 = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="ServiceManagement"
                component={ServiceManagement}
                options={{ title: 'ServiceManagement' }}
            />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} options={{ title: 'ServiceDetails' }} />
            <Stack.Screen name="CreateService" component={CreateService} options={{ title: 'CreateService' }} />
            <Stack.Screen name="UpdateService" component={UpdateService} options={{ title: 'UpdateService' }} />
            <Stack.Screen name="ScheduleList" component={ScheduleList} options={{ title: 'ScheduleList' }} />
            <Stack.Screen name="CreateSchedule" component={CreateSchedule} options={{ title: 'CreateSchedule' }} />
            <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
        </Stack.Navigator>
    );
};

const MyStack05 = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Provider" component={Provider} options={{ title: 'Provider' }} />
            <Stack.Screen name="UserInfo" component={UserInfo} options={{ title: 'UserInfo' }} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: 'ChangePassword' }} />
        </Stack.Navigator>
    );
};

const MyStack06 = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChatList" component={ChatList} options={{ title: 'ChatList' }} />
            <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
        </Stack.Navigator>
    );
};

const Tab = createBottomTabNavigator();
const MyTab = () => {
    const user = useContext(MyUserContext);
    return (
        <Tab.Navigator>
            {user === null ? (
                <>
                    <Tab.Screen
                        name="Services"
                        component={MyStack}
                        options={{
                            title: 'Dịch vụ du lịch',
                            tabBarIcon: () => <FontAwesomeIcon icon="clipboard-list" size={24} color="#124f9f" />,
                        }}
                    />
                    <Tab.Screen
                        name="Login"
                        component={MyStack01}
                        options={{
                            title: 'Đăng nhập',
                            tabBarIcon: () => <FontAwesomeIcon icon="right-to-bracket" size={24} color="#124f9f" />,
                        }}
                    />
                </>
            ) : (
                <>
                    {user.role === 1 && ( //Customer
                        <>
                            <Tab.Screen
                                name="Home"
                                component={MyStack02}
                                options={{
                                    title: 'Trang chủ',
                                    tabBarIcon: () => <FontAwesomeIcon icon="home" size={24} color="#124f9f" />,
                                }}
                            />
                            <Tab.Screen
                                name="Chat"
                                component={ChatList}
                                options={{
                                    title: 'Tin nhắn',
                                    tabBarIcon: () => <FontAwesomeIcon icon="comment-dots" size={24} color="#124f9f" />,
                                }}
                            />
                            <Tab.Screen
                                name="Profile"
                                component={MyStack03}
                                options={{
                                    title: 'Cá nhân',
                                    tabBarIcon: () => <FontAwesomeIcon icon="user" size={24} color="#124f9f" />,
                                }}
                            />
                        </>
                    )}
                    {user.role === 2 && ( //Service Provider
                        <>
                            <Tab.Screen
                                name="Home"
                                component={MyStack04}
                                options={{
                                    title: 'Trang chủ',
                                    tabBarIcon: () => <FontAwesomeIcon icon="home" size={24} color="#124f9f" />,
                                }}
                            />
                            <Tab.Screen
                                name="ChatBox"
                                component={MyStack06}
                                options={{
                                    title: 'Tin nhắn',
                                    tabBarIcon: () => <FontAwesomeIcon icon="comment-dots" size={24} color="#124f9f" />,
                                }}
                            />
                            <Tab.Screen
                                name="Profile"
                                component={MyStack05}
                                options={{
                                    title: 'Cá nhân',
                                    tabBarIcon: () => <FontAwesomeIcon icon="user" size={24} color="#124f9f" />,
                                }}
                            />
                        </>
                    )}
                </>
            )}
        </Tab.Navigator>
    );
};

export default function App() {
    const [user, dispatch] = useReducer(MyUserReducer, null);

    return (
        <NavigationContainer>
            <MyUserContext.Provider value={user}>
                <MyDispatcherContext.Provider value={dispatch}>
                    <MyTab />
                </MyDispatcherContext.Provider>
            </MyUserContext.Provider>
        </NavigationContainer>
    );
}
