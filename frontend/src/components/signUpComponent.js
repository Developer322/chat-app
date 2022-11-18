import { useReducer, useRef, useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useCallback } from 'react';
import ReactTooltip from 'react-tooltip';
import { FaGithub } from 'react-icons/fa/index.js';
import { AiOutlineUser } from 'react-icons/ai/index.js';
import { BiShield } from 'react-icons/bi/index.js';
import { useNavigate } from 'react-router-dom';

const actionTypes = {
    SET_IS_SIGN_IN: 'SET_IS_SIGN_IN',
    SET_IS_SIGN_UP: 'SET_IS_SIGN_UP',
    SET_IS_LOADING: 'SET_IS_LOADING',
    SET_IS_LOADED: 'SET_IS_LOADED'
};

const SignIn = ({ setUsername }) => {
    const navigate = useNavigate();

    function equalTo(ref, msg = '${path} must be the same as ${reference}') {
        return this.test({
            name: 'equalTo',
            exclusive: false,
            message: msg,
            params: {
                reference: ref.path
            },
            test: function (value) {
                return value === this.resolve(ref);
            }
        });
    }

    Yup.addMethod(Yup.string, 'equalTo', equalTo);

    const reducer = (state, action) => {
        switch (action.type) {
            case actionTypes.SET_IS_SIGN_IN:
                return { ...state, isSignIn: true };
            case actionTypes.SET_IS_SIGN_UP:
                return { ...state, isSignIn: false };
            case actionTypes.SET_IS_LOADING:
                return { ...state, isLoading: true };
            case actionTypes.SET_IS_LOADED:
                return { ...state, isLoading: false };
            default:
                return state;
        }
    };

    const setIsSignIn = () => dispatch({ type: actionTypes.SET_IS_SIGN_IN });
    const setIsSignUp = () => dispatch({ type: actionTypes.SET_IS_SIGN_UP });

    const initialState = {
        isSignIn: true
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .label('Username')
                .min(3, 'Username must be at least 3 characters long')
                .required(),
            password: Yup.string()
                .label('Password')
                .min(3, 'Password must be at least 3 characters long')
                .required(),
            confirmPassword: !state.isSignIn
                ? Yup.string()
                      .equalTo(Yup.ref('password'), "Passwords don't match!")
                      .required()
                : Yup.string()
        }),
        onSubmit: useCallback(
            (values) => {
                setUsername(values.username);

                if (state.isSignIn) {
                    signIn.mutate({
                        username: values.username,
                        password: values.password
                    });
                } else {
                    signUp.mutate({
                        username: values.username,
                        password: values.password
                    });
                }
            },
            [state.isSignIn, setUsername]
        )
    });

    const signUp = useMutation((newUser) => axios.post('/api/user', newUser));
    const signIn = useMutation((loginInfo) =>
        axios.post('/api/login', loginInfo)
    );

    if (signUp.isSuccess || signIn.isSuccess) {
        navigate('/');
    }

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center animate-appearing">
            <div className="lg:w-1/4 md:w-1/3 w-3/5 px-6 flex flex-col grow justify-center items-center">
                <h1 className="text-xl font-semibold mb-8">
                    {state.isSignIn ? 'Sign in' : 'Sign up'}
                </h1>
                {signIn.isError ? (
                    <div className="text-red-300 py-2">
                        {signIn?.error?.response?.status?.toString() === '401'
                            ? 'Username or password is invalid'
                            : signIn.message}
                    </div>
                ) : null}
                {signUp.isError ? (
                    <div className="text-red-300 py-2">
                        {signUp.error.message}
                    </div>
                ) : null}
                <InputComponent
                    key="usernameField"
                    error={formik.errors.username}
                    value={formik.values.username}
                    handleChange={formik.handleChange}
                    inputProps={{
                        name: 'username',
                        placeholder: 'Username',
                        type: 'text',
                        id: 'username',
                        autoComplete: 'username'
                    }}
                    icon={<AiOutlineUser />}
                />
                <InputComponent
                    key="passwordField"
                    error={formik.errors.password}
                    value={formik.values.password}
                    handleChange={formik.handleChange}
                    inputProps={{
                        name: 'password',
                        placeholder: 'Password',
                        type: 'password',
                        id: 'password',
                        autoComplete: state.isSignIn
                            ? 'current-password'
                            : 'new-password'
                    }}
                    icon={<BiShield />}
                />
                {!state.isSignIn ? (
                    <InputComponent
                        key="confirmPasswordField"
                        error={formik.errors.confirmPassword}
                        value={formik.values.confirmPassword}
                        handleChange={formik.handleChange}
                        inputProps={{
                            name: 'confirmPassword',
                            placeholder: 'Confirm password',
                            type: 'password',
                            id: 'confirmPassword',
                            autoComplete: 'new-password'
                        }}
                        icon={<BiShield />}
                    />
                ) : null}
                <button
                    type="submit"
                    className="block w-full rounded bg-teal-300 font-bold text-white py-1 px-2 mt-2 mb-4"
                    onClick={formik.handleSubmit}
                >
                    {state.isSignIn ? 'Sign in' : 'Sign up'}
                </button>
                <div>
                    <span className="cursor-default">
                        {state.isSignIn ? (
                            <>
                                {"Don't have an account? "}
                                <span
                                    className="text-mainColor"
                                    onClick={setIsSignUp}
                                >
                                    Sign Up
                                </span>
                            </>
                        ) : (
                            <>
                                {'Already registered? '}
                                <span
                                    className="text-mainColor"
                                    onClick={setIsSignIn}
                                >
                                    Sign In
                                </span>
                            </>
                        )}
                    </span>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <FaGithub />
                <a className="mx-2" href="https://github.com/Developer322">
                    My GitHub
                </a>
                {` ${new Date().getFullYear()}.`}
            </div>
        </div>
    );
};

const InputComponent = ({ handleChange, value, inputProps, icon, error }) => {
    const tipRef = useRef();
    const [isBlur, setIsBlur] = useState(false);

    useEffect(() => {
        if (typeof error === 'string' && isBlur) {
            ReactTooltip.show(tipRef?.current);
        } else {
            ReactTooltip.hide(tipRef?.current);
        }
    }, [error, isBlur]);

    return (
        <div className="w-full relative my-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button
                    type="submit"
                    className="text-mainColor p-1 focus:outline-none focus:shadow-outline cursor-default"
                >
                    {icon}
                </button>
            </span>
            <input
                ref={tipRef}
                {...inputProps}
                data-tip
                data-for={`${inputProps.name}Tip`}
                value={value}
                onChange={handleChange}
                onBlur={() => setIsBlur(true)}
                onFocus={() => setIsBlur(false)}
                className="w-full py-2 text-sm text-black bg-gray-50 rounded-md pl-12 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            />
            <ReactTooltip
                id={`${inputProps.name}Tip`}
                type="error"
                effect="solid"
                place="right"
                event="neverEmit"
                eventOff="neverEmitToo"
                border
            >
                {error}
            </ReactTooltip>
        </div>
    );
};

export { SignIn };
