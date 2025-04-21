<template>
    <VContainer fluid class="fill-height pa-0">
        <VRow no-gutters class="fill-height">
            <!-- Danh sách nhóm -->
            <VCol cols="12" md="3" class="pa-4 group-list"
                style="border-right: 1px solid #ddd; background-color: #f9f9f9;">
                <!-- Danh sách + nút tạo -->
                <div class="d-flex justify-space-between align-center mb-4">
                    <h3 class="mb-0">Danh sách nhóm</h3>
                    <VBtn icon size="small" style="background-color: bisque;" variant="text"
                        @click="openCreateGroupModal">
                        <VIcon icon="mdi-plus" />
                    </VBtn>
                </div>

                <VTextField density="comfortable" variant="outlined" placeholder="Tìm nhóm..."
                    prepend-inner-icon="mdi-magnify" class="mb-4 search-box" />

                <VListItem v-for="group in groups" :key="group.id" rounded class="mb-2 group-item">
                    <template #prepend>
                        <VAvatar color="primary" size="40">
                            <span class="text-white">{{ group.name ? group.name.charAt(0) : '?' }}</span>
                        </VAvatar>
                    </template>
                    <VListItemTitle class="font-weight-medium">{{ group.name }}</VListItemTitle>
                    <VListItemSubtitle>{{ group.lastMessage || 'Chưa có tin nhắn' }}</VListItemSubtitle>
                </VListItem>
            </VCol>

            <!-- Khu vực chat nhóm -->
            <VCol cols="12" md="9" class="d-flex flex-column chat-area">
                <!-- Header -->
                <div class="chat-header">
                    <div class="d-flex align-center gap-3">
                        <VAvatar color="primary" size="40">
                            <span class="text-white">{{ selectedGroup.name.charAt(0) }}</span>
                        </VAvatar>
                        <div>
                            <h3 class="text-subtitle-1 font-weight-medium mb-0">{{ selectedGroup.name }}</h3>
                            <p class="text-caption text-grey">{{ selectedGroup.memberCount }} thành viên</p>
                        </div>
                    </div>
                    <VBtn icon variant="text" style="color: #7b7b7b;">
                        <VIcon icon="mdi-dots-vertical" />
                    </VBtn>
                </div>

                <!-- Tin nhắn -->
                <div class="chat-messages">
                    <div v-if="!selectedGroup.name" class="empty-chat-message">
                        <p class="empty-chat-text">Chọn nhóm để bắt đầu trò chuyện</p>
                    </div>
                    <div v-for="(msg, index) in messages" :key="index" class="message-wrapper" :class="msg.type">
                        <span class="sender-name">{{ msg.senderName }}</span>
                        <div class="message-bubble">
                            {{ msg.content }}
                            <div class="message-time">{{ msg.time }}</div>
                        </div>
                    </div>
                </div>

                <!-- Nhập tin nhắn -->
                <div class="chat-input-bar">
                    <VTextField density="comfortable" variant="outlined" placeholder="Nhập tin nhắn..."
                        class="flex-grow-1" hide-details style="border-radius: 30px;" />
                    <VBtn icon color="primary" class="rounded-full">
                        <VIcon icon="mdi-send" />
                    </VBtn>
                    <VBtn icon class="rounded-full" color="grey">
                        <VIcon icon="mdi-paperclip" />
                    </VBtn>
                    <VBtn icon class="rounded-full" color="grey">
                        <VIcon icon="mdi-image" />
                    </VBtn>
                </div>
            </VCol>
        </VRow>
    </VContainer>
</template>

<script setup>
import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons-vue'; // Import biểu tượng tìm kiếm
import { Checkbox, Input, Modal } from 'ant-design-vue';
import { h, ref } from 'vue';

const groups = [
    { id: 1, name: 'Frontend Team', lastMessage: 'Hẹn 10h họp nhé!', memberCount: 5 },
    { id: 2, name: 'Backend Team', lastMessage: 'Push code lên git rồi nha.', memberCount: 4 },
    { id: 3, name: 'Design Team', lastMessage: '', memberCount: 3 },
];

const selectedGroup = {
    name: 'Frontend Team',
    memberCount: 5
};

const messages = [
    { content: 'Hello team!', senderName: 'An', type: 'received', time: '09:30' },
    { content: 'Chào buổi sáng!', senderName: 'Tú', type: 'sent', time: '09:31' },
];

const newGroupName = ref('');
const selectedMembers = ref([]);
const users = ref([
    { id: 1, name: 'An', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Tú', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Hà', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Minh', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, name: 'Ngọc', avatar: 'https://i.pravatar.cc/150?img=5' },
]);

function openCreateGroupModal() {
    selectedMembers.value = [];
    const searchQuery = ref('');
    const avatarUrl = ref('');

    Modal.confirm({
        title: 'Tạo nhóm mới',
        width: 500,
        icon: h(UsergroupAddOutlined, { style: { fontSize: '24px', color: '#3f51b5' } }),
        content: () =>
            h('div', [
                // Thanh tìm kiếm thành viên (đưa lên đầu)
                h(Input, {
                    value: searchQuery.value,
                    'onUpdate:value': val => (searchQuery.value = val),
                    placeholder: 'Tìm thành viên...',
                    allowClear: true,
                    prefix: h(SearchOutlined), // Sử dụng biểu tượng tìm kiếm
                    style: { marginBottom: '16px' },
                }),

                // Hàng chứa avatar + tên nhóm
                h('div', {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '16px',
                    }
                }, [
                    // Upload avatar
                    h('div', [
                        h('label', { style: 'font-weight: 500' }, 'Chọn ảnh nhóm'),
                        h('input', {
                            type: 'file',
                            accept: 'image/*',
                            onChange: (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        avatarUrl.value = reader.result;
                                    };
                                    reader.readAsDataURL(file);
                                }
                            },
                            style: { marginTop: '8px', display: 'none' },
                            id: 'avatar-upload',
                        }),
                        h('label', {
                            for: 'avatar-upload',
                            style: {
                                display: 'inline-block',
                                padding: '8px 12px',
                                backgroundColor: '#3f51b5',
                                color: 'white',
                                borderRadius: '12px',
                                cursor: 'pointer',
                            },
                        }, 'Chọn ảnh'),
                        avatarUrl.value &&
                        h('img', {
                            src: avatarUrl.value,
                            style: {
                                width: '48px',
                                height: '48px',
                                marginTop: '8px',
                                borderRadius: '50%', // Hình tròn
                                objectFit: 'cover',
                            },
                        }),
                    ]),

                    // Nhập tên nhóm
                    h(Input, {
                        value: newGroupName.value,
                        'onUpdate:value': val => (newGroupName.value = val),
                        placeholder: 'Nhập tên nhóm...',
                        allowClear: true,
                        style: {
                            flexGrow: 1,
                            marginTop: '26px'
                        },
                    }),
                ]),

                h('div', { style: 'font-weight: 500; margin-bottom: 8px' }, 'Chọn thành viên:'),

                // Danh sách thành viên với avatar và cuộn khi dài
                h('div', { style: { maxHeight: '200px', overflowY: 'auto' } }, // Cuộn khi danh sách dài
                    users.value
                        .filter(user =>
                            user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
                        )
                        .map(user =>
                            h(Checkbox, {
                                checked: selectedMembers.value.includes(user.id),
                                onChange: e => {
                                    if (e.target.checked) {
                                        selectedMembers.value.push(user.id);
                                    } else {
                                        selectedMembers.value = selectedMembers.value.filter(id => id !== user.id);
                                    }
                                },
                            }, () =>
                                h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
                                    h('img', {
                                        src: user.avatar,
                                        style: {
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%', // Hình tròn
                                            objectFit: 'cover',
                                        },
                                    }),
                                    h('span', {}, user.name)
                                ])
                            )
                        )
                ),

                // Hiển thị danh sách thành viên đã chọn bên dưới (ẩn nếu không có ai được chọn)
                selectedMembers.value.length > 0 &&
                h('div', { style: { marginTop: '16px', fontWeight: '500' } }, 'Thành viên đã chọn:'),
                selectedMembers.value.length > 0 &&
                h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' } },
                    selectedMembers.value
                        .map(id => {
                            const user = users.value.find(u => u.id === id);
                            return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                                h('img', {
                                    src: user.avatar,
                                    style: {
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%', // Hình tròn
                                        objectFit: 'cover',
                                    },
                                }),
                                h('span', {}, user.name)
                            ])
                        })
                ),
            ]),

        zIndex: 2000,
        okText: 'Tạo nhóm',
        cancelText: 'Hủy',
        onOk() {
            console.log('Tên nhóm:', newGroupName.value);
            console.log('Thành viên:', selectedMembers.value);
            console.log('Avatar (base64):', avatarUrl.value);
            newGroupName.value = '';
            selectedMembers.value = [];
            avatarUrl.value = '';
        },
    });
}
</script>



<style scoped>
.chat-area {
    height: 75vh;
    display: flex;
    flex-direction: column;
    position: relative;
}

.chat-header {
    height: 64px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    flex-shrink: 0;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #fafafa;
}

.chat-input-bar {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-top: 1px solid #eee;
    background-color: #fff;
}

.empty-chat-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #aaa;
    font-size: 16px;
    font-weight: 500;
}

.message-wrapper.sent .message-bubble {
    background-color: #d1e7dd;
    align-self: flex-end;
}

.message-wrapper.received .message-bubble {
    background-color: #fff;
    align-self: flex-start;
}

.message-bubble {
    padding: 8px 12px;
    border-radius: 16px;
    max-width: 60%;
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.sender-name {
    font-size: 13px;
    color: #555;
    margin-bottom: 2px;
}

.message-time {
    font-size: 11px;
    color: #999;
    text-align: right;
    margin-top: 4px;
}
</style>
