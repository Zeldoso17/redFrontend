import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { } from 'react-router';
import { map } from 'lodash';
import configRouting from './configRouting';

export default function Routing(props) {
    const { setRefreshCheckLogin } = props;
    return (
        <Router>
            <Routes>
                {map(configRouting, (route, index) => ( // Estamos iterando el array de configRouting
                    <Route key={index} path={route.path} exact={route.exact} element={<route.page setRefreshCheckLogin={setRefreshCheckLogin}/>}> {/* Estamos creando una ruta por cada elemento del array*/}
                    </Route>
                ))}
            </Routes>
        </Router>
    );
}
