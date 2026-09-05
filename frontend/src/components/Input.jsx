import React from "react";

export default function Input({label, icon: Icon, type, name, placeholder, value, onChange }){
    return(
        <div style = {styles.inputGroup}>
            <label style = {styles.label}></label>
            <div style = {styles.inputWrapper}>
                {Icon && <Icon size = {18} style = {styles.icon}/>}
                <input type = {type} name = {name} placeholder = {placeholder} value = {value} onChange= {onChange} style = {styles.input} required/>
            </div>
        </div>
    );
}
const styles = {
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.85rem', color: '#FAFAFA', fontWeight: '500' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: '12px', color: '#A3A3A3' },
  input: {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    backgroundColor: '#1C1917',
    border: '1px solid #404040',
    borderRadius: '8px',
    color: '#FAFAFA',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
};