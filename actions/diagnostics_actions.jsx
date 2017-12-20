// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import UserStore from 'stores/user_store.jsx';

export function trackEvent(category, event, props) {
    if (global.window && global.window.analytics) {
        const properties = Object.assign({category, type: event, user_actual_id: UserStore.getCurrentId()}, props);
        const options = {
            context: {
                ip: '0.0.0.0'
            },
            page: {
                path: '',
                referrer: '',
                search: '',
                title: '',
                url: ''
            },
            anonymousId: '00000000000000000000000000'
        };
        global.window.analytics.track('event', properties, options);
    }
}

export function clearMarks(names) {
    if (!global.__DEV__) {
        return;
    }
    names.forEach((name) => performance.clearMarks(name));
}

export function mark(name) {
    if (!global.__DEV__) {
        return;
    }
    performance.mark(name);
}

export function measure(name1, name2) {
    if (!global.__DEV__) {
        return;
    }

    // Check for existence of entry name to avoid DOMException
    const performanceEntries = performance.getEntries();
    if (![name1, name2].every((name) => performanceEntries.find((item) => item.name === name))) {
        return null;
    }

    const measurementName = `${name1} - ${name2}`;
    performance.measure(`🐐 Mattermost: ${measurementName}`, name1, name2);
    const lastDuration = mostRecentDurationByEntryName(measurementName);

    // Clean up
    performance.clearMeasures(measurementName);
    return lastDuration;
}

function mostRecentDurationByEntryName(entryName) {
    const entriesWithName = performance.getEntriesByName(entryName);
    return entriesWithName.map((item) => item.duration)[entriesWithName.length - 1];
}