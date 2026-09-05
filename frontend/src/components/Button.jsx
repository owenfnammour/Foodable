import React from "react";

export default function Button({children, icon: Icon, type = 'submit'}){
    return(
        <button type = {type} style = {styles.button}>
            {Icon && <Icon size = {18}/>}
            <span>{children}</span>
        </button>
    );
}
const styles = {
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.85rem',
    marginTop: '0.5rem',
    backgroundColor: '#FF5733',
    color: '#FAFAFA',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};