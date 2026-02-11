'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function FacebookMsg() {
    const pathname = usePathname()

    useEffect(() => {
        // Initialize Facebook SDK
        var chatbox = document.getElementById('fb-customer-chat');
        chatbox.setAttribute("page_id", "61587738368961");
        chatbox.setAttribute("attribution", "biz_inbox");

        window.fbAsyncInit = function () {
            FB.init({
                xfbml: true,
                version: 'v18.0'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, [pathname])

    return (
        <>
            <div id="fb-root"></div>
            <div id="fb-customer-chat" className="fb-customerchat"></div>
        </>
    )
}
