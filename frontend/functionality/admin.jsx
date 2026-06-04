import '../styling/admin.css';
import React from 'react';
import Dashboard from '../sub-functionality/adminDashboard';
import AdminUser from '../sub-functionality/adminUser';
import AdminSeller from '../sub-functionality/adminSeller';
import AdminProducts from '../sub-functionality/AdminProducts';
import AdminOrder from '../sub-functionality/adminOrder';
import AdminSetting from '../sub-functionality/adminSetting';
import useAuth from '../globalProps/useAuth';
import {useNavigate} from 'react-router-dom'


export default function Admin() {
    const [activeTab, setActiveTab] = React.useState('dashboard');

    const {logout} = useAuth()

    const navigate = useNavigate()

    function SignOut(){
      logout()
      navigate('/login')
    }

    return (
      <div className='pannel-container'>
        <div className='barside-panel'>

          <div className='title-panel'>
            <i className="fa-solid fa-store"></i>
              <div>
                <h2>E-Commerce</h2>
                <p>Admin Panel</p>
              </div>        
          </div>

          <ul>

            <li className={`li-sidebare ${activeTab==='dashboard' ? 'active' : ''}`} onClick={()=>setActiveTab('dashboard')}>
              <i className="fa-solid fa-house"></i>
              <p>Dashboard</p>
            </li>

            <li className={`li-sidebare ${activeTab==='adminUser' ? 'active' : ''}`} onClick={()=>setActiveTab('adminUser')}>
              <i class="fa-solid fa-user"></i>
              <p>Users</p>
            </li>

            <li className={`li-sidebare ${activeTab==='adminSeller' ? 'active' : ''}`} onClick={()=>setActiveTab('adminSeller')}>
              <i className="fa-solid fa-user-tie"></i>
              <p>Sellers</p>
            </li>

            <li className={`li-sidebare ${activeTab==='adminProduct' ? 'active' : ''}`} onClick={()=>setActiveTab('adminProduct')}>
              <i className="fa-brands fa-product-hunt"></i>
              <p>Products</p>
            </li>

            <li className={`li-sidebare ${activeTab==='adminOrder' ? 'active' : ''}`} onClick={()=>setActiveTab('adminOrder')}>
              <i className="fa-solid fa-bag-shopping"></i>
              <p>Orders</p>
            </li>

            <li className={`li-sidebare ${activeTab==='adminSetting' ? 'active' : ''}`} onClick={()=>setActiveTab('adminSetting')}>
              <i className="fa-solid fa-gear"></i>
              <p>Settings</p>
            </li>

            <li className='li-sidebare' onClick={SignOut}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <p>Logout</p>
            </li>
              
          </ul>
                
        </div>

        {activeTab==='dashboard' && <Dashboard activeTab={setActiveTab}/>}

        {activeTab==='adminUser' && <AdminUser/>}

        {activeTab==='adminSeller' && <AdminSeller/>}

        {activeTab==='adminProduct' && <AdminProducts/>}

        {activeTab==='adminOrder' && <AdminOrder/>}

        {activeTab==='adminSetting' && <AdminSetting/>}

      </div>
    );
}