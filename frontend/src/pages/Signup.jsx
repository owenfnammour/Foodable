import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import {UserPlus, Mail, Lock, User} from 'lucide-react'; 
import API from "../api/axios";    

export default function Signup(){

    const [formData, setFormData] = useState({name: '', email: '', password: ''});

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await API.post('/api/auth/signup', formData);
            
            alert('Account has been created, Please log in');
        }
        catch(error){
            console.log('Registration failed: ', error.reponse?.data?.message || error.message);
        } 
    }

    return(
        <div style = {styles.container}>
            <div style = {styles.card}>
                <div style = {styles.header}>
                    <h1 style = {styles.title}>NutriPulse</h1>
                    <p style = {styles.subtitle}> Create your account</p>
                </div>

                <form onSubmit={handleSubmit} style = {styles.form}>
                    <Input label="Full Name" icon={User} type="text" name="name" placeholder="Wini za poo" value={formData.name} onChange={handleChange} />
                    <Input label="Email Address" icon={Mail} type="email" name="email" placeholder="YoPhoneLingin@yahoo.com" value={formData.email} onChange={handleChange} />
                    <Input label="Password" icon={Lock} type="password" name="password" placeholder="Epic will never ask for your password" value={formData.password} onChange={handleChange} />

                    <Button icon = {UserPlus}> Create Account</Button>
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