import React from "react";
import '../styling/admin.css';
import { BarChart , Bar , ResponsiveContainer , XAxis , YAxis , CartesianGrid , Tooltip , Legend} from "recharts";
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();
import useAuth from '../globalProps/useAuth';

export default function Dashboard(props){
    const [generalInfo , setGeneralInfo] = React.useState({})

    const [order , setOrder] = React.useState([])

    const {token} = useAuth()

    React.useEffect(()=>{
      const adminDashboard = async()=>{
        try{
          const {data} = await apiClient.get('/dashboard/admin-dashboard' , {headers : {Authorization : `Bearer ${token}`}})

          setGeneralInfo(data)
        }catch(error){
          console.log(error)
        }
      }
        adminDashboard()
    },[])

    React.useEffect(()=>{
        const fetchOrders = async () => {
            try {
                const { data } = await apiClient.get('/order/dashboard', {headers : {Authorization : `Bearer ${token}`}});
                setOrder(data.orders);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    },[])
        

    const revenue = order.reduce((sum, order) => sum + order.total, 0);

    const revenueData = React.useMemo(() => {
        const grouped = order.reduce((acc, ord) => {
            const date = new Date(ord.createdAt).toISOString().split('T')[0];
            if (!acc[date]) acc[date] = 0;
            acc[date] += ord.total;
            return acc;
        }, {});
        return Object.entries(grouped).sort(([a], [b]) => new Date(a) - new Date(b)).map(([date, revenue]) => {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return { date: formattedDate, revenue };
        });
    }, [order]);

    const ordersData = React.useMemo(() => {
        const grouped = order.reduce((acc, ord) => {
            const date = new Date(ord.createdAt).toISOString().split('T')[0];
            if (!acc[date]) acc[date] = 0;
            acc[date] += 1;
            return acc;
        }, {});
        return Object.entries(grouped).sort(([a], [b]) => new Date(a) - new Date(b)).map(([date, orders]) => {
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return { date: formattedDate, orders };
        });
    }, [order]);

    return(
    <div className="dashboard-content">
      <header className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin! </p>
        </div>

      </header>

      <section className="dashboard-general-info">
        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user"></i>
          <div>
            <p >{generalInfo.totalUser}</p>
            <p>Total Users</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-user-tie"></i>
          <div>
            <p >{generalInfo.totalSeller}</p>
            <p>Total Sellers</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-brands fa-product-hunt" ></i>
          <div>
            <p >{generalInfo.totalProducts}</p>
            <p>Total Products</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-bag-shopping"></i>
          <div>
            <p>{generalInfo.totalOrders}</p>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="dashboard-general-info-flex" >
          <i className="fa-solid fa-dollar-sign" ></i>
          <div>
            <p>{revenue} $</p>
            <p>Total Revenue</p>
          </div>
        </div>
      </section>

      <h2 style={{ textAlign: 'center', margin: '30px 0 20px', fontSize: '1.5em', fontWeight: 'bold', color: '#333' }}>Analytics Overview</h2>
      <section className="chart-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '20px' }}>
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} />
              <Legend />
              <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>Orders Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <Tooltip formatter={(value) => [value, 'Orders']} contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} />
              <Legend />
              <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="dashbord-second-info">

        <div className="table-order">
          <h3 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5em', fontWeight: 'bold', color: '#333' }}>Latest 5 Orders</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {order
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((ord) => (
                  <tr key={ord._id}>
                    <td>{ord._id}</td>
                    <td>{ord.shippingAddress.fullName}</td>
                    <td>${ord.total}</td>
                    <td>{ord.status}</td>
                    <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="admin-quick-activity">
          <h2>Quick Actions</h2>

          <button className="admin-btn" onClick={()=>props.activeTab('adminProduct')}><i className="fa-solid fa-plus quick-icon"></i> Add Product</button>

          <button className="admin-btn" onClick={()=>props.activeTab('adminUser')}><i className="fa-solid fa-user quick-icon"></i> Manage Users</button>

          <button className="admin-btn" onClick={()=>props.activeTab('adminSeller')}><i className="fa-solid fa-user-tie quick-icon"></i> Manage Sellers</button>

        </div>

      </div>

    </div>
    )
}