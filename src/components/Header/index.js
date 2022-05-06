import './Header.css'
import { AuthContext } from '../../contexts/user'
import { useContext } from 'react'
import avatar from '../../assets/avatar.png'
import { Link } from 'react-router-dom'
import { FiHome,FiUser,FiSettings } from "react-icons/fi";






export default function Header(){

    const {user} = useContext(AuthContext)



    return(
        <div className='sidebar'>
            <div className='img'>
                <img src={user.AvatarUrl == null ? avatar : user.AvatarUrl} alt='foto-avatar' />
            </div>

            <Link  to='/dashboard'>
            <FiHome color='#fff' size={24}/>
            Chamados
            </Link>

            <Link to='/customers'>
            <FiUser color='#fff' size={24}/>
            Clientes
            </Link>

            <Link to='/profile'>
            <FiSettings color='#fff' size={24}/>
            Configurações
            </Link>
            
        </div>
    )
}