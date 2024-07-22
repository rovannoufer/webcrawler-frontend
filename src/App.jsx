import React, { useState } from 'react';
import axios from 'axios';
import image from '../src/img/icons.png';
import Loading from './loading';
import { Toaster, toast } from "react-hot-toast";


function App() {
    const [url, setUrl] = useState('');
    const [fileInfo, setFileInfo] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (err) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValidUrl(url)) {
            toast.error('Please enter a valid URL.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('https://web-crawler-l1we.onrender.com/crawl', { url }, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'text/plain' });
            const fileURL = window.URL.createObjectURL(blob);
            setFileInfo({ name: 'report.txt', size: blob.size });
            setFileUrl(fileURL);

            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target.result);
            };
            reader.readAsText(blob);
            
            setLoading(false);
            
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    const handleViewFile = () => {
        if (fileContent) {
            const newWindow = window.open();
            newWindow.document.write('<pre>' + fileContent + '</pre>');
        }
    };

    const handleDownloadFile = () => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', 'report.txt');
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };

    return (
        <>
         <Toaster />
        <div className="flex flex-col gap-6">
            <div className="bg-[#f3f6ff] flex text-center text-slate-950">
                <img src={image} className='h-9 relative top-5 left-2'/>
                <p className="p-5 font-sans text-3xl">WEB CRAWLER</p>
            </div>

            <div className="flex flex-col shadow-2xl bg-white rounded-2xl relative top-48 lg:w-[45%] lg:left-[26%]">
                <p className="font-bold text-3xl p-5">Start Crawling</p>

                <form onSubmit={handleSubmit} className="bg-[#f3f6ff] p-5 m-5 relative">
                    <input
                        className="p-5 w-[100%]"
                        type="text"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="Put a URL here to start crawling"
                    />
                    <button className="bg-[#7155ca] p-5 absolute right-5 w-32 text-white" type="submit">
                        GO
                    </button>
                </form>

               

                  {
                    loading ? <Loading /> : <div >
                    {fileInfo && (
                           < div className='bg-[#f3f6ff] flex flex-col items-center p-5 m-5'>
                            <p>File Name: {fileInfo.name}</p>
                            <p>File Size: {fileInfo.size} bytes</p>
                            <div className="flex gap-4 mt-4">
                                <button onClick={handleViewFile} className="bg-[#7155ca] p-2 text-white rounded-lg">VIEW</button>
                                <button onClick={handleDownloadFile} className="bg-[#7155ca] p-2 text-white rounded-lg">DOWNLOAD</button>
                            </div>
                           </div >
                     )} 
                 
                    
                    </div>
                    }


                    <div className='m-5'>
                    <h1 className='text-3xl font-bold mb-2'> What Is Web Crawler? </h1>
                      <p className='bg-[#f3f6ff]  p-5 text-lg'>A web crawler, also known as a spider or search engine bot, is a program that 
                        systematically browses the internet to gather information from web pages.
                         The goal is to learn what each page is about so that the information can be retrieved when needed</p>
                    </div>

                    <div className='m-5'>
                    <h1 className='text-3xl font-bold mb-2'>How Does Web Crawler Work? </h1>
                      <p className='bg-[#f3f6ff]  p-5 text-lg'> 
                      A web crawler, or spider, is a type of bot that is typically operated by search engines like Google and Bing. 
                      Their purpose is to index the content of websites all across the Internet so that those websites can appear in search engine results.
                      However, a web crawler will follow certain policies that make it more selective about which pages to crawl, in what order to crawl them,
                       and how often they should crawl them again to check for content updates.</p>
                    </div>
            </div>
        </div>
        
        </>
    );
}

export default App;
