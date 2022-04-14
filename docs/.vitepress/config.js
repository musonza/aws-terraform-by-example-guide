module.exports = {
    title: 'AWS and Terraform by example',
    description: 'AWS and Terraform by example',

    markdown: {
        lineNumbers: true
    },

    themeConfig: {
        repo: 'vuejs/vitepress',
        docsDir: 'docs',
        docsBranch: 'main',
        editLinks: true,
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',

        nav: [
            {
                text: 'Release Notes',
                link: 'https://github.com/vuejs/vitepress/releases'
            }
        ],

        sidebar: {
            '/guide/': getGuideSidebar(),
            '/config/': getConfigSidebar(),
            '/': getGuideSidebar()
        }
    }
}

function getGuideSidebar() {
    return [
        {
            text: 'Guide',
            children: [
                { text: 'About this guide', link: '/guide/' },
                { text: 'Requirements', link: '/guide/2-requirements' },
                { text: 'Project Setup', link: '/guide/3-project-setup' },
                { text: 'Chatbot Creation', link: '/guide/4-chatbot-creation' },
                { text: 'Chatbot code hooks', link: '/guide/5-chatbot-code-hooks' }
            ]
        }
    ]
}

function getConfigSidebar() {
    return [
        {
            text: 'App Config',
            children: [{ text: 'Basics', link: '/config/basics' }]
        },
        {
            text: 'Theme Config',
            children: [
                { text: 'Homepage', link: '/config/homepage' },
                { text: 'Algolia Search', link: '/config/algolia-search' },
                { text: 'Carbon Ads', link: '/config/carbon-ads' }
            ]
        }
    ]
}