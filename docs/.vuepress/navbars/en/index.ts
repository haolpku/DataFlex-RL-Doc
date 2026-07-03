/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const enNavbar = defineNavbarConfig([
    // { text: 'Home', link: '/' },
    // { text: 'Blog', link: '/blog/' },
    // { text: 'Tags', link: '/blog/tags/' },
    // { text: 'Archives', link: '/blog/archives/' },
    {
        text: 'Guide',
        // link: '/en/guide/',
        icon: 'icon-park-outline:guide-board',
        items: [

            {
                text: 'Basic Info',
                items: [
                    {
                        text: 'Introduction',
                        link: '/en/notes/guide/basicinfo/intro.md',
                        icon: 'mdi:tooltip-text-outline',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Framework Design',
                        link: '/en/notes/guide/basicinfo/framework.md',
                        icon: 'material-symbols:auto-transmission-sharp',
                        activeMatch: '^/guide/'
                    },
                    {
                        text: 'Installation',
                        link: '/en/notes/guide/basicinfo/install.md',
                        icon: 'material-symbols-light:download-rounded',
                        activeMatch: '^/guide/'
                    },
                ]
            },
            {
                text: 'Mechanisms',
                items: [
                    {
                        text: 'Reweighter',
                        link: '/en/notes/guide/reweighter/quickstart.md',
                        icon: 'solar:scale-outline',
                        activeMatch: '^/guide/reweighter/'
                    },
                    {
                        text: 'Selector',
                        link: '/en/notes/guide/selector/quickstart.md',
                        icon: 'solar:filter-outline',
                        activeMatch: '^/guide/selector/'
                    },
                    {
                        text: 'Mixer',
                        link: '/en/notes/guide/mixer/quickstart.md',
                        icon: 'solar:shuffle-outline',
                        activeMatch: '^/guide/mixer/'
                    }
                ]
            }
        ]
    },
    // {
    //     text: 'API Reference',
    //     link: '/en/notes/api/1.home.md',
    //     icon: 'material-symbols:article-outline'
    // },
])
