import React, { useState, useRef, useEffect, useMemo } from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import ReactMarkdown from 'react-markdown';
import robot_img from '../assets/ic5.png';
import { sendMessageChatService } from './chatbotService';
import LinkBox from './LinkBox';
import commonQuestionsData from '../db/commonQuestions.json';
import { sampling } from './utils';

const ChatbotAvatar = ({ img }) => (
    <div className="chat-image avatar">
        <div className="w-8 lg:w-10 rounded-full border-2 border-orange-300">
            <img src={img} alt="avatar" />
        </div>
    </div>
);

export default function ChatBotV2() {
    const models = [
        {
            value: 'LegalBizAI_pro',
            name: 'LegalBizAI Pro',
        },
        {
            value: 'LegalBizAI',
            name: 'LegalBizAI',
        },
    ];
    const getModelName = (modelValue) =>
        models.find((m) => m.value === modelValue)?.name ?? models[0].name;
    const messagesAreaRef = useRef(null);
    const inputRef = useRef(null);
    const [timeOfRequest, setTimeOfRequest] = useState(0);
    const [promptInput, setPromptInput] = useState('');
    const [model, setModel] = useState(models[0].value);
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoad] = useState(false);
    const [isGen, setIsGen] = useState(false);
    const [counter, setCounter] = useState(0);
    const [dataChat, setDataChat] = useState([
        [
            'start',
            [
                'Xin chào! Đây là LegalBizAI, trợ lý đắc lực về luật doanh nghiệp của bạn! Bạn muốn tìm kiếm thông tin về điều gì? Đừng quên chọn mô hình phù hợp để mình có thể giúp bạn tìm kiếm thông tin chính xác nhất nha.',
                null,
                null,
            ],
        ],
    ]);
    const questionBoxRef = useRef(null);

    const isFirstChat = dataChat.length === 1;

    const commonQuestions = useMemo(
        () => sampling(commonQuestionsData, 3),
        [dataChat]
    );

    useEffect(() => {
        scrollToEndChat();
        inputRef.current.focus();
    }, [chatHistory, isLoading]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeOfRequest((timeOfRequest) => timeOfRequest + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval = undefined;
        if (isLoading) {
            setCounter(1);
            interval = setInterval(() => {
                setCounter((prevCounter) => {
                    if (prevCounter < 30) {
                        return prevCounter + 1;
                    } else {
                        clearInterval(interval);
                        return prevCounter;
                    }
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const scrollToEndChat = () => {
        // messagesAreaRef.current.scrollIntoView({ behavior: 'auto' });
        messagesAreaRef.current?.lastChild?.scrollIntoView?.({
            behavior: 'smooth',
            block: 'start',
        });
    };

    // Hàm autoResize
    const autoResize = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    // Hàm onChangeHandler
    const onChangeHandler = (event) => {
        setPromptInput(event.target.value);
        autoResize(event.target);
    };

    const sendMessageChat = async () => {
        if (promptInput !== '' && isLoading === false) {
            setTimeOfRequest(0);
            setIsGen(true);
            setPromptInput('');
            inputRef.current.style.height = 'auto';
            setIsLoad(true);
            setDataChat((prev) => [...prev, ['end', [promptInput, model]]]);
            setChatHistory((prev) => [promptInput, ...prev]);

            try {
                const result = await sendMessageChatService(promptInput, model);
                setDataChat((prev) => [
                    ...prev,
                    [
                        'start',
                        [
                            result.result,
                            result.source_documents,
                            result.references,
                            model,
                        ],
                    ],
                ]);
            } catch (error) {
                console.log(error);
                setDataChat((prev) => [
                    ...prev,
                    [
                        'start',
                        [
                            'Xin lỗi, hiện mình không thể kết nối với server. Vui lòng đợi một chút và hỏi lại nhé!',
                            null,
                            null,
                        ],
                    ],
                ]);
            } finally {
                setIsLoad(false);
                setIsGen(false);
                inputRef.current.focus();
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của sự kiện Enter
            sendMessageChat();
        }
    };

    const handleQuickQuestionClick = (question) => {
        const selectedQuestion = commonQuestions.find(
            (q) => q.question === question
        );
        if (selectedQuestion) {
            setDataChat((prev) => [
                ...prev,
                ['end', [selectedQuestion.question, model]],
                [
                    'start',
                    [
                        selectedQuestion.result,
                        selectedQuestion.source_documents,
                        selectedQuestion.references,
                        model,
                    ],
                ],
            ]);
            setChatHistory((prev) => [selectedQuestion.question, ...prev]);
            scrollToEndChat();
        }
    };

    return (
        <div
            className="bg-gradient-to-r from-orange-50 to-orange-100 flex flex-col overflow-hidden"
            style={{ height: '87vh' }}
        >
            <style>
                {`
                .chat-bubble-gradient-receive {
                    background: linear-gradient(90deg, #f9c6c6 0%, #ffa98a 100%);
                    color: black;
                }
                .chat-bubble-gradient-send {
                    background: linear-gradient(90deg, #2c9fc3 0%, #2f80ed 100%);
                    color: white;
                }
                .input-primary {
                    border-color: #FFA07A;
                }
                .input-primary:focus {
                    outline: none;
                    border-color: #FF6347;
                    box-shadow: 0 0 5px #FF6347;
                }
                .btn-send {
                    background-color: #f8723c !important; 
                    border-color: #FFA07A !important; 
                }
                .btn-send:hover {
                    background-color: #ff9684 !important; 
                    border-color: #FF6347 !important; 
                }
                .textarea-auto-resize {
                    resize: none;
                    overflow: hidden;
                }
                .common-question {
                    transition: all 0.3s ease-in-out;
                }
                .common-question:hover {
                    transform: translateY(-5px);
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .slide-up {
                    animation: slideUp 0.5s ease-out;
                }
                `}
            </style>

            {/* Dropdown for model selection on mobile */}
            <div className="lg:hidden p-2 flex justify-center bg-gradient-to-r from-orange-50 to-orange-100">
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-3/4 p-2 border rounded-lg shadow-md bg-white"
                >
                    {models.map((model) => (
                        <option key={model.value} value={model.value}>
                            {model.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                {/* <div className="hidden lg:block bg-white w-64 p-2 b g-gray-50 overflow-hidden">
                    
                </div> */}
                {/* Chat history */}
                {/* <div className="menu p-2 text-base-content rounded-2xl">
                    <h2 className="font-bold mb-2 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text will-change-auto [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] motion-reduce:!tracking-normal max-[1280px]:!tracking-normal [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]">
                        Lịch sử trò chuyện
                    </h2>
                    <ul className="menu flex-nowrap text-sm flex-1 overflow-y-auto overflow-x-hidden">
                        {chatHistory.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                Hiện chưa có cuộc hội thoại nào
                            </p>
                        ) : (
                            chatHistory.map((mess, i) => (
                                <li key={i}>
                                    <p>
                                        <FontAwesomeIcon icon={faMessage} />
                                        {mess.length < 20
                                            ? mess
                                            : mess.slice(0, 20) + '...'}
                                    </p>
                                </li>
                            ))
                        )}
                    </ul>
                </div> */}

                {/* Main chat area */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto flex flex-col">
                        <div
                            id="chat-area"
                            className="
            flex-grow bg-white rounded-t-3xl border-2 border-b-0 px-4
            scrollbar-thin scrollbar-thumb-gray-300
            scrollbar-thumb-rounded-full scrollbar-track-rounded-full
            flex flex-col justify-end
            "
                        >
                            <div
                                className="flex-grow overflow-auto"
                                ref={messagesAreaRef}
                            >
                                {dataChat.map((dataMessages, i) =>
                                    dataMessages[0] === 'start' ? (
                                        <div
                                            className="chat chat-start drop-shadow-md"
                                            key={i}
                                        >
                                            <ChatbotAvatar img={robot_img} />
                                            <div className="chat-bubble chat-bubble-gradient-receive break-words">
                                                <ReactMarkdown>
                                                    {dataMessages[1][0]}
                                                </ReactMarkdown>
                                                {dataMessages[1][1] &&
                                                    dataMessages[1][1].length >
                                                        0 && (
                                                        <>
                                                            <div className="divider m-0"></div>
                                                            <LinkBox
                                                                links={
                                                                    dataMessages[1][1]
                                                                }
                                                            />
                                                        </>
                                                    )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="chat chat-end" key={i}>
                                            <div className="chat-bubble shadow-xl chat-bubble-gradient-send">
                                                {dataMessages[1][0]}
                                                <>
                                                    <div className="divider m-0"></div>
                                                    <p className="font-light text-xs text-cyan-50">
                                                        Mô hình:{' '}
                                                        {getModelName(
                                                            dataMessages[1][1]
                                                        )}
                                                    </p>
                                                </>
                                            </div>
                                        </div>
                                    )
                                )}
                                {isLoading && (
                                    <div className="chat chat-start">
                                        <ChatbotAvatar img={robot_img} />
                                        <div className="flex justify-start px-4 py-2">
                                            <div className="chat-bubble chat-bubble-gradient-receive break-words flex items-center">
                                                <ScaleLoader
                                                    color="#0033ff"
                                                    loading={true}
                                                    height={15}
                                                />
                                                <span className="ml-2">{`${counter}/30s`}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Common questions boxes (CQB) */}
                            {isFirstChat && !isLoading && !isGen && (
                                <div
                                    className="relative py-4 pe-4 ps-1 overflow-hidden"
                                    id="CQB"
                                >
                                    <div
                                        ref={questionBoxRef}
                                        className="carousel flex overflow-x-auto scrollbar-hide space-x-2  bg-white rounded-lg slide-up scrollbar-none"
                                    >
                                        {commonQuestions.map(
                                            (question, index) => (
                                                <div
                                                    key={index}
                                                    className="carousel-item common-question flex flex-col justify-center align-middle bg-gradient-to-r from-blue-100 to-pink-100 p-3 rounded-lg shadow cursor-pointer hover:shadow-lg text-sm w-full sm:w-1/2 lg:flex-1 lg:w-auto"
                                                    onClick={() =>
                                                        handleQuickQuestionClick(
                                                            question.question
                                                        )
                                                    }
                                                >
                                                    <p className="">
                                                        {question.question}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    {/* <button
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                                        onClick={() => handleScroll('left')}
                                    >
                                        &lt;
                                    </button>
                                    <button
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                                        onClick={() => handleScroll('right')}
                                    >
                                        &gt;
                                    </button> */}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat input area */}
                    <div className="bg-white border-2 border-t-0 rounded-b-3xl px-4">
                        <div className="flex">
                            <textarea
                                placeholder="Nhập câu hỏi tại đây..."
                                className="flex-grow mr-2 shadow-xl border-2 focus:outline-none px-2 rounded-2xl input-primary textarea-auto-resize"
                                onChange={onChangeHandler}
                                onKeyDown={handleKeyDown}
                                disabled={isGen}
                                value={promptInput}
                                ref={inputRef}
                                rows="1"
                                style={{
                                    resize: 'none',
                                    overflow: 'hidden',
                                    lineHeight: '3',
                                }}
                            />
                            <button
                                disabled={isGen}
                                onClick={sendMessageChat}
                                className="drop-shadow-md btn btn-active btn-primary btn-square btn-send"
                            >
                                <svg
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    color="white"
                                    height="15px"
                                    width="15px"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-center p-1 mt-2">
                            <b>Lưu ý: </b>LegalBizAI có thể mắc lỗi. Hãy kiểm
                            tra các thông tin quan trọng!{' '}
                            <span className="hidden lg:inline">
                                © 2024 LegalBizAI. All rights reserved.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
