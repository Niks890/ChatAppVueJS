<template>
    <VContainer fluid class="fill-height pa-0">
        <VRow no-gutters class="fill-height">
            <!-- Danh sách bạn bè -->
            <v-slide-x-transition>
                <VCol v-show="!isMobile || showUserList" cols="12" md="3" class="pa-4 user-list"
                    style="border-right: 1px solid #ddd; background-color: #f9f9f9;">
                    <div class="d-flex justify-space-between align-center mb-4" v-if="isMobile">
                        <strong>Danh sách</strong>
                        <VBtn icon @click="showUserList = false" variant="text">
                            <VIcon icon="mdi-close" />
                        </VBtn>
                    </div>

                    <VTextField v-model="search" density="comfortable" variant="outlined" placeholder="Tìm kiếm..."
                        prepend-inner-icon="mdi-magnify" class="mb-4 search-box" />

                    <VList density="comfortable" nav class="friend-list">
                        <VListItem v-for="(item, index) in 10" :key="index" rounded class="mb-2 friend-item"
                            @click="showUserList = isMobile ? false : true">
                            <template #prepend>
                                <VAvatar color="primary" size="40">
                                    <span class="text-white">{{ item }}</span>
                                </VAvatar>
                            </template>
                            <VListItemTitle class="font-weight-medium">Người dùng {{ item }}</VListItemTitle>
                            <VListItemSubtitle v-show="!isMobile">Tin nhắn gần đây...</VListItemSubtitle>
                        </VListItem>
                    </VList>
                </VCol>
            </v-slide-x-transition>

            <!-- Nội dung chat -->
            <VCol cols="12" md="9" class="d-flex flex-column chat-area">
                <!-- Header -->
                <div class="chat-header">
                    <div class="d-flex align-center gap-3">
                        <VBtn icon class="d-md-none" @click="showUserList = true" variant="text">
                            <VIcon icon="mdi-menu" />
                        </VBtn>
                        <VAvatar color="primary" size="40">
                            <span class="text-white">A</span>
                        </VAvatar>
                        <div>
                            <h3 class="text-subtitle-1 font-weight-medium mb-0">Tên người dùng / Nhóm</h3>
                            <p class="text-caption text-grey">Đang hoạt động</p>
                        </div>
                    </div>
                    <VBtn icon variant="text" style="color: #7b7b7b;">
                        <VIcon icon="mdi-dots-vertical" />
                    </VBtn>
                </div>
                <!-- Tin nhắn gửi -->
                <div v-for="(msg, index) in messages" :key="index" class="d-flex">
                    <VChip :class="{ 'sent': msg.type === 'sent', 'received': msg.type === 'received' }"
                        :color="msg.type === 'sent' ? 'primary' : 'grey'" class="message-chip">
                        {{ msg.content }}
                    </VChip>
                </div>


                <!-- Input chat -->
                <div class="chat-input-bar">
                    <VTextField ref="inputRef" v-model="message" density="comfortable" variant="outlined"
                        placeholder="Nhập tin nhắn..." class="flex-grow-1" hide-details style="border-radius: 30px;" />
                    <VBtn icon @click="sendMessage" color="primary" class="rounded-full">
                        <VIcon icon="mdi-send" />
                    </VBtn>
                    <VBtn icon @click="" class="rounded-full" color="grey">
                        <VIcon icon="mdi-paperclip" />
                    </VBtn>
                    <VBtn icon @click="" class="rounded-full" color="grey">
                        <VIcon icon="mdi-image" />
                    </VBtn>
                </div>
            </VCol>
        </VRow>
    </VContainer>
</template>



<script setup>
import { onMounted, ref } from 'vue';
import api from '../../../configs/axios.js';

// Reactive variables
const search = ref('');
const message = ref('');
const showUserList = ref(false);
const isMobile = ref(false);
const inputRef = ref(null);
const messages = ref([]); // Store messages here

// Check if device is mobile
onMounted(() => {
    const checkMobile = () => {
        isMobile.value = window.innerWidth < 768;
        if (!isMobile.value) showUserList.value = true;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Echo listener for real-time chat updates
    window.Echo.channel('chat')
        .listen('.message.sent', (e) => {
            console.log('Tin nhắn realtime nhận được:', e.message);
            // Add new message to chat
            messages.value.push({ content: e.message, type: 'received' });
        });
});

// Send message to backend and add it to the UI
const sendMessage = async () => {
    if (!message.value.trim()) return;

    // Send message to backend Laravel
    await api.post('/send-message', {
        message: message.value,
    });

    // Show the message in the UI
    messages.value.push({ content: message.value, type: 'sent' });
    message.value = '';
    inputRef.value?.focus();
};
</script>


<style scoped>
.chat-input-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background-color: #fff;
    z-index: 10;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-header {
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 16px;
    padding-bottom: 80px;
    max-height: calc(100vh - 220px);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.message-chip {
    padding: 8px 16px;
    max-width: 80%;
    word-break: break-word;
}

.message-chip.sent {
    background-color: #3f51b5;
    color: white;
    align-self: flex-end;
}

.message-chip.received {
    background-color: #e0e0e0;
    color: black;
    align-self: flex-start;
}

.search-box {
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.friend-list {
    max-height: calc(100vh - 160px);
    overflow-y: auto;
}

.friend-item {
    transition: background-color 0.3s;
}

.friend-item:hover {
    background-color: #e8eaf6;
}

@media (max-width: 768px) {
    .user-list {
        position: absolute;
        z-index: 100;
        width: 100%;
        height: 100vh;
        background-color: white;
        top: 0;
        left: 0;
    }

    .chat-header {
        padding: 10px 12px;
    }

    .chat-messages {
        padding: 12px;
        gap: 0.5rem;
    }

    .chat-input-bar {
        padding: 8px 12px;
        gap: 0.3rem;
    }

    .v-text-field input {
        font-size: 14px;
    }

    .v-btn .v-icon {
        font-size: 20px;
    }

    .v-avatar {
        width: 32px !important;
        height: 32px !important;
        font-size: 14px;
    }

    .v-list-item__title {
        font-size: 0.95rem;
    }

    .v-list-item__subtitle {
        font-size: 0.75rem;
    }
}
</style>
