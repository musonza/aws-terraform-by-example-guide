module.exports = {
    title: 'AWS and Terraform by example',
    description: 'AWS and Terraform by example',

    markdown: {
        lineNumbers: true
    },

    themeConfig: {
        repo: 'musonza/aws-terraform-by-example-vitepress',
        docsDir: 'docs',
        docsBranch: 'master',
        editLinks: true,
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',

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
            children: [
                { text: 'About this guide', link: '/guide/' },
                { text: 'Requirements', link: '/guide/2-requirements' },
                { text: 'Project setup', link: '/guide/3-project-setup' },
                { text: 'Chatbot creation', link: '/guide/4-chatbot-creation' },
                { text: 'Chatbot code hooks', link: '/guide/5-chatbot-code-hooks' },
                { text: 'Data storage', link: '/guide/6-data-storage' }
            ]
        }
    ]
}