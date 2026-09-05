import React, {useState} from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { LogIn, Mail, Lock } from "lucide-react";
import API from "../api/axios";

export default function Login(){
    const [formData, setFormData] = useState({email: '', password: ''});

    const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await API.post('/api/auth/login', formData);
            
            localStorage.setItem('token', res.data.token);

            alert('Logged in successfully');
        }
        catch(error){
            console.log('Log in failed: ', error.response?.data?.message || error.message);
        }
    }

    return(
        <div style = {styles.container}>
            <div style = {styles.card}>
                <div style = {styles.header}>
                    <h1 style = {styles.title}>NutriPulse</h1>
                    <p style = {styles.subtitle}>Welcome back! Please log in</p>
                </div>

                <form onSubmit = {handleSubmit} style = {styles.form}>
                    <Input label="Email Address" icon={Mail} type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                    <Input label="Password" icon={Lock} type="password" name="password" placeholder="*********" value={formData.password} onChange={handleChange} />
                    
                    <Button icon= {LogIn}>Log In</Button>
                </form>
            </div>
        </div>
    );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1C1917' },
  card: { width: '100%', maxWidth: '400px', padding: '2.5rem', backgroundColor: '#262626', borderRadius: '12px', border: '1px solid #333' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  title: { margin: '0 0 0.5rem 0', color: '#FF5733', fontSize: '2rem', fontWeight: '700' },
  subtitle: { margin: 0, color: '#A3A3A3', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' }
};