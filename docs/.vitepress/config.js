module.exports = {
    lang: 'en-US',
    title: 'AWS and Terraform by example',
    description: 'AWS and Terraform by example',

    lastUpdated: true,

    markdown: {
        lineNumbers: true
    },

    themeConfig: {
        repo: 'musonza/aws-terraform-by-example-vitepress',
        docsDir: 'docs',
        docsBranch: 'master',
        editLinks: true,
        editLinkText: 'Edit this page on GitHub',
        lastUpdatedText: 'Last Updated',

        socialLinks: [
            { icon: 'github', link: 'https://github.com/musonza' },
            { icon: 'linkedin', link: 'https://linkedin.com/in/srfullstackdeveloper' },
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2022-present Tinashe Musonza'
        },

        sidebar: {
            '/guide/': getGuideSidebar(),
            '/': getGuideSidebar()
        }
    }
}

function getGuideSidebar() {
    return [
        {
            text: 'Guide',
            collapsible: false,
            items: [
                { text: 'About this guide', link: '/guide/' },
                { text: 'Requirements', link: '/guide/2-requirements' },
                { text: 'Project setup', link: '/guide/3-project-setup' },
                { text: 'Chatbot creation', link: '/guide/4-chatbot-creation' },
                { text: 'Chatbot code hooks', link: '/guide/5-chatbot-code-hooks' },
                { text: 'Data storage', link: '/guide/6-data-storage' },
                { text: 'Chatbot Web Interface', link: '/guide/7-chatbot-web-interface' },
                { text: 'Introducing Cloud9', link: '/guide/8-introducing-cloud9' },
            ]
        }
    ]
}