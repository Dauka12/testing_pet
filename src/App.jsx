import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import './settings/i18n.js';
const OlympiadRoutes = lazy(() => import('./features/olympiad/OlympiadRoutes.tsx'));

function App() {

    return (
        <div className="App">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/*" element={<Suspense><OlympiadRoutes /></Suspense>} />
                        </Routes>
                    </BrowserRouter>
        </div>
    );
}

export default App;
