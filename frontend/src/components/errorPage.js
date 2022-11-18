import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <main className="h-screen w-full flex flex-col justify-center items-center bg-gradient-to-bl from-green-100 to-green-300">
            <h1 className="text-9xl font-extrabold text-white tracking-widest">
                {error?.status || '404'}
            </h1>
            <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
                <p>
                    <i>{error?.statusText || error?.message || 'Not found'}</i>
                </p>
            </div>
            <button className="mt-5 text-white p-1 focus:outline-none focus:shadow-outline cursor-default border border-white shadow px-6 py-2 hover:text-gray-100">
                <Link to="/">Home</Link>
            </button>
        </main>
    );
};

export default ErrorPage;
