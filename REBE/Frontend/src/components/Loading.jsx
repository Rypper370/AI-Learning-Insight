import React from "react";
import { VscLoading } from "react-icons/vsc";
import '../styles/loading.css';

function Loading({message="Loading..."}){
    return(
        <div className="loading-container">
            <VscLoading className="loading-icon"/>
            <p className="loading-text">{message}</p>
        </div>
    )
}

export default Loading;