import { useSelector } from 'react-redux';

const useCurrentUser = () => {
    return useSelector((state: any) => {
        const { visitProfile } = state.users;

        return visitProfile || null;
    });
};

export default useCurrentUser;
