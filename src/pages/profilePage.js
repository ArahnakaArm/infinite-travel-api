import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Drawer from "../components/Drawer";

function ProfilePage(props) {
    let { id } = useParams();
    const [width, setWindowWidth] = useState(1000);
   

    const updateDimensions = () => {
        const width = window.innerWidth
        setWindowWidth(width)

    }

    window.addEventListener("resize", updateDimensions)
    return (
        <div style={
            { marginLeft: width <= 600 ? 0 : 180, width: '100%', height: '100%' }}>
            <Drawer />
            {id}
        </div>
    )

}

export default ProfilePage;