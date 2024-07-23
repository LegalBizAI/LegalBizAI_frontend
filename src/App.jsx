import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ChatBotV1 from './components/ChatBot-v1';
import ChatBot from './components/ChatBot';
import FAQPage from './pages/FAQPage';
import IssuePage from './pages/IssuePage';
// import Footer from './components/Footer';
import { Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow flex">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="chat" element={<ChatBot />} />
                    <Route path="chat-v1" element={<ChatBotV1 />} />
                    <Route path="issue" element={<IssuePage />} />
                    <Route path="faq" element={<FAQPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            {/* <Footer /> */}
        </div>
    );
}
