import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { setScreenSize, checkPassword } from '../Util';

function Home() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!checkPassword(sessionStorage.getItem('bucket-list-bingo-password'))) {
            const password = prompt("ENTER PASSWORD")
            if (checkPassword(password)) {
                sessionStorage.setItem('bucket-list-bingo-password', password)
            }
            else {
                setUsers([]);
                alert("올바르지 않은 비밀번호입니다.");
                return;
            }
        }
        setScreenSize();
        window.addEventListener('resize', setScreenSize);
        try {
            let users = [];
            const users_json = JSON.parse(process.env.REACT_APP_USERS);
            for (const user in users_json) {
                users.push({'id': user, 'name': users_json[user]});
            }
            setUsers(users);
        } catch (e) {
            alert("올바르지 않은 사용자 목록입니다. 관리자에게 문의하세요.");
            setUsers([]);
        }
        return () => {
            window.removeEventListener('resize', setScreenSize)
        }
    }, []);

    const handleOnChange = (e) => {
        navigate('/bingo/' + e.target.value)
    }

    return (
        <div id='home-div'>
            <p>Bucket List Bingo</p>
            <select name="users-select" id="users-select" onChange={handleOnChange}>
                <option key="placeholder" value="" hidden>--Select Name--</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <img src='https://www.dropbox.com/s/nq7f1yy8i9zlmj5/00620_HD.jpg?raw=1' alt=''/>
        </div>
    )
}

export default Home;
