import React, { useReducer } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Chat from './components/chatList.js';
import MessageList from './components/messages.js';
import { SignIn } from './components/signUpComponent.js';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorPage from './components/errorPage.js';

const queryClient = new QueryClient();

const App = () => {
    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_USERNAME':
                localStorage.setItem('username', action?.payload?.username);
                return { ...state, username: action?.payload?.username };
            case 'SET_CHATID':
                return { ...state, chatId: action?.payload?.chatId };
            default:
                return state;
        }
    };

    const initialValues = {
        username: localStorage.getItem('username'),
        chatId: ''
    };

    const setChatIdAction = chatId => ({
        type: 'SET_CHATID',
        payload: { chatId }
    })

    const setUsernameAction = username => ({
        type: 'SET_USERNAME',
        payload: { username }
    })

    const [state, dispatch] = useReducer(reducer, initialValues);

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <div className="w-full h-screen flex bg-gradient-to-bl from-green-100 to-green-300">
                    <Chat
                        setChatId={ (chatId) =>
                            dispatch(setChatIdAction(chatId))
                        }
                    />
                    <MessageList
                        username={state.username}
                        chatId={state.chatId}
                    />
                </div>
            ),
            errorElement: <ErrorPage />
        },
        {
            path: '/login',
            element: (
                <SignIn
                    setUsername={(username) =>
                        dispatch(setUsernameAction(username))
                    }
                />
            ),
            errorElement: <ErrorPage />
        },
        {
            path: '*',
            element: <ErrorPage />
        }
    ]);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};

export default App;
