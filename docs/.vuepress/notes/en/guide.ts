import type { ThemeNote } from 'vuepress-theme-plume'
import { defineNoteConfig } from 'vuepress-theme-plume'

export const Guide: ThemeNote = defineNoteConfig({
    dir: 'guide',
    link: '/guide/',
    sidebar: [
        {
            text: 'Basic Info',
            collapsed: false,
            icon: 'carbon:idea',
            prefix: 'basicinfo',
            items: [
                'intro',
                'framework',
                'install',
            ],
        },
        {
            text: 'DataFlex Reweighter',
            collapsed: false,
            icon: 'solar:scale-outline',
            prefix: 'reweighter',
            items: [
                'quickstart',
                'tutorial',
                'advantage_reweight',
                'per_advantage',
            ],
        },
        {
            text: 'DataFlex Selector',
            collapsed: false,
            icon: 'solar:filter-outline',
            prefix: 'selector',
            items: [
                'quickstart',
                'tutorial',
                'difficulty_filtering',
                'gfpo',
                'pods_maxvar',
            ],
        },
        {
            text: 'DataFlex Mixer',
            collapsed: false,
            icon: 'solar:shuffle-outline',
            prefix: 'mixer',
            items: [
                'quickstart',
                'tutorial',
                'dump_ucb',
                'tscl',
            ],
        },
    ],
})
