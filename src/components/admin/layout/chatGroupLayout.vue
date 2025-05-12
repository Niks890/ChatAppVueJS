<template>
  <VContainer fluid class="fill-height pa-0">
    <VRow no-gutters class="fill-height">
      <!-- Danh sách nhóm -->
      <VCol cols="12" md="3" class="pa-4 group-list" style="border-right: 1px solid #ddd;">
        <!-- Danh sách + nút tạo -->
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="mb-0">Danh sách nhóm</h3>
          <VBtn icon size="small" style="background-color: bisque;" variant="text" @click="openCreateGroupModal">
            <VIcon icon="mdi-plus" />
          </VBtn>
        </div>

        <VTextField density="comfortable" variant="outlined" placeholder="Tìm nhóm..." prepend-inner-icon="mdi-magnify"
          class="mb-4 search-box" />

        <VListItem v-for="group in groups" :key="group.id" rounded class="mb-2 group-item" @click="selectGroup(group)">
          <template #prepend>
            <VAvatar color="primary" size="40">
              <span class="text-white">{{ group.name ? group.name.charAt(0) : '?' }}</span>
            </VAvatar>
          </template>
          <VListItemTitle class="font-weight-medium">{{ group.name }}</VListItemTitle>
          <VListItemSubtitle>{{ group.lastMessage || 'Chưa có tin nhắn' }}</VListItemSubtitle>
        </VListItem>
      </VCol>

      <VCol v-if="!selectedGroup.name" cols="12" md="9" class="d-flex align-center justify-center chat-area">
        <div class="welcome-message-out text-center">
          <VAvatar color="primary" size="60" class="mb-4">
            <VIcon icon="mdi-account-plus" size="40" />
          </VAvatar>
          <h2 class="welcome-text">Chào mừng đến với hệ thống chat!</h2>
          <p class="empty-chat-text">Chọn người nhận để bắt đầu trò chuyện</p>
        </div>
      </VCol>

      <!-- Khu vực chat nhóm -->
      <VCol v-if="selectedGroup.name" cols="12" md="9" class="d-flex flex-column chat-area">
        <!-- Header -->
        <div class="chat-header">
          <div class="d-flex align-center gap-3">
            <VAvatar color="primary" size="40">
              <span class="text-white">{{ selectedGroup.name.charAt(0) }}</span>
            </VAvatar>
            <div>
              <h3 class="text-subtitle-1 font-weight-medium mb-0">{{ selectedGroup.name }}</h3>
              <p class="text-caption text-grey">{{ selectedGroup.members_count }} thành viên</p>
            </div>
          </div>
          <VMenu offset-y>
            <template #activator="{ props }">
              <VBtn icon variant="text" style="color: #7b7b7b;" v-bind="props">
                <VIcon icon="mdi-dots-vertical" />
              </VBtn>
            </template>

            <VList>
              <VListItem @click="openCreateGroupModal">
                <VListItemTitle>Tạo nhóm mới</VListItemTitle>
              </VListItem>
              <VListItem @click="handleViewInfo">
                <VListItemTitle>Xem thông tin</VListItemTitle>
              </VListItem>
              <VListItem @click="handleDeleteChat">
                <VListItemTitle>Xóa đoạn chat</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>

        <!-- Tin nhắn -->

        <!-- Tin nhắn -->
        <div class="chat-messages" ref="chatBoxRef">
          <!-- Nếu chưa có tin nhắn -->
          <div v-if="messages.length === 0"
            class="welcome-message pa-6 d-flex flex-column align-center justify-center text-center">
            <v-icon size="48" color="primary">mdi-chat</v-icon>
            <h3 class="mt-3 font-weight-medium text--primary">Chào mừng bạn đến với hệ thống chat</h3>
            <p class="mt-1 text-grey-darken-1">
              Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên.
            </p>
          </div>

          <!-- Nếu đã có tin nhắn -->
          <div v-else v-for="(msg, index) in messages" :key="index" class="message-wrapper" :class="msg.type">
            <span v-if="msg.type === 'received'" class="sender-name">{{ msg.senderName }}</span>

            <div class="message-bubble">
              <!-- Hiển thị ảnh nếu có -->
              <div v-if="msg.messageType === 'file' || msg.messageType === 'text_file'">
                <img :src="msg.file" alt="Hình ảnh" class="chat-image" />
              </div>

              <!-- Hiển thị nội dung -->
              <div v-if="msg.messageType === 'text' || msg.messageType === 'text_file'">
                {{ msg.content }}
              </div>

              <div class="message-time">
                <span>{{ formatMessageDate(msg.createdAt) }}</span> -
                <span>{{ formatTime(msg.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <VBtn v-show="showScrollToBottom" class="scroll-to-bottom" icon color="primary" @click="scrollToBottom">
          <VIcon icon="mdi-arrow-down" />
        </VBtn>
        <!-- Input -->
        <div class="chat-input-bar">

          <VTextField ref="inputRef" v-model="message" density="comfortable" variant="outlined"
            placeholder="Nhập tin nhắn..." class="flex-grow-1" hide-details style="border-radius: 30px;"
            @keydown.enter="handleEnter" />

          <VBtn icon @click="sendMessage" color="primary" class="rounded-full">
            <VIcon icon="mdi-send" />
          </VBtn>
          <VBtn icon class="rounded-full" color="grey" @click="triggerFileInput">
            <VIcon icon="mdi-paperclip" />
          </VBtn>
          <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange" />
          <VBtn icon class="rounded-full" color="grey" @click="triggerFileInput">
            <VIcon icon="mdi-image" />
          </VBtn>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons-vue';
import { Checkbox, Input, Modal } from 'ant-design-vue';
import { debounce } from 'lodash'; // Import debounce from 'lodash.debounce';
import { h, nextTick, onMounted, ref, watch } from 'vue';
import * as yup from 'yup';
import { userId } from '../../../composables/userAuth.js';
import api from '../../../configs/axios.js';

const chatBoxRef = ref(null);
const fileInput = ref(null);
const showScrollToBottom = ref(false);
const message = ref('');
const messages = ref([]); // Mảng chứa tin nhắn
const selectedGroupId = ref(null);
const groups = ref([]); // Mảng chứa danh sách nhóm
const selectedGroup = ref({
  name: '',
  memberCount: 0
}); // Nhóm đang được chọn
const newGroupName = ref('');
const selectedMembers = ref([]);
const searchQuery = ref('');
const avatarUrl = ref('');
const users = ref([]); // Danh sách thành viên từ API
// Hàm debounce để gọi API
const debouncedFetchUsers = debounce(fetchUsers, 500); // Đặt delay 500ms


const handleEnter = (event) => {
  if (event.shiftKey) {
    // Cho phép xuống dòng
    return;
  }
  event.preventDefault(); // Ngăn xuống dòng mặc định
  sendMessage();
};


const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  });
};

const formatMessageDate = (datetime) => {
  const messageDate = new Date(datetime);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Kiểm tra nếu tin nhắn là hôm nay
  if (messageDate.toDateString() === today.toDateString()) {
    return "Hôm nay";
  }
  // Kiểm tra nếu tin nhắn là hôm qua
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Hôm qua";
  }
  // Nếu không phải hôm nay hoặc hôm qua, trả về ngày trong định dạng dd/mm/yyyy
  return messageDate.toLocaleDateString("vi-VN");
};

// Scroll xuống cuối khung chat
const scrollToBottom = () => {
  const el = chatBoxRef.value;
  if (el) el.scrollTop = el.scrollHeight;
};

const handleScroll = () => {
  const el = chatBoxRef.value;
  if (!el) return;
  // Nếu cách bottom > 100px thì hiện nút
  showScrollToBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight > 100;
};

// Quan trọng: Set up lại các event listener sau khi component được tạo lại
const setupEventListeners = () => {
  if (chatBoxRef.value) {
    chatBoxRef.value.addEventListener('scroll', handleScroll);
    // Kích hoạt handleScroll một lần ban đầu để thiết lập showScrollToBottom
    handleScroll();
  }
};

// Quan trọng: Xóa các event listener khi component unmount
const cleanupEventListeners = () => {
  if (chatBoxRef.value) {
    chatBoxRef.value.removeEventListener('scroll', handleScroll);
  }
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const fileUrl = response.data.url; // URL của file
      await sendMessage(fileUrl);  // Gửi tin nhắn kèm file
    } catch (error) {
      console.error('Error uploading or sending file:', error);
    }
  }
};

const createGroupSchema = yup.object({
  name: yup.string().required('Tên nhóm không được để trống'),
  // avatar: yup.string().required('Ảnh nhóm là bắt buộc'),
  members: yup.array().min(3, 'Phải chọn ít nhất 3 thành viên'),
});
// Hàm lấy tin nhắn từ API
const fetchMessages = async (groupId) => {
  try {
    const res = await api.post('/message-group', {
      group_id: groupId,
    });
    // messages.value = res.data.data; // Gán tin nhắn vào mảng messages
    // console.log(res.data.data);
    messages.value = res.data.data.map(msg => {
      let messageType = 'text';
      if (msg.file_path && msg.message) {
        messageType = 'text_file';
      } else if (msg.file_path) {
        messageType = 'file';
      }
      return {
        content: msg.message,
        type: msg.sender_id === userId.value ? 'sent' : 'received',
        senderName: msg.sender.name,
        file: msg.file_path,
        createdAt: msg.created_at,
        messageType: messageType,
      };
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}

// Hàm để lựa chọn nhóm và lấy tin nhắn
const selectGroup = async (group) => {
  selectedGroup.value = group;
  selectedGroupId.value = group.id;

  // Gọi API để lấy tin nhắn khi nhóm được chọn
  await fetchMessages(group.id);

  // Đợi DOM cập nhật xong trước khi gán listener và scroll
  await nextTick();

  setupEventListeners();
  scrollToBottom();
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const updateLastMessage = (groupId, message) => {
  // Update last message in the users array
  const user = users.value.find(u => u.group_id === groupId);
  if (user) {
    user.lastMessage = message;
  }
};



// Hàm để lấy danh sách nhóm của người dùng
const fetchGroups = async () => {
  try {
    const response = await api.get('/groups');
    // console.log(response.data.data);
    groups.value = response.data.data; // Gán dữ liệu nhóm vào biến groups
    // console.log(response);
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
}

const sendMessage = async (fileUrl = null) => {
  if (!message.value.trim() && !fileUrl) return;  // Không gửi nếu không có tin nhắn hay file
  try {
    const response = await api.post('/send-message-group', {
      message: message.value,
      group_id: selectedGroupId.value,
      user_id: userId.value,
      file: fileUrl || null // Gửi file nếu có
    });

    if (response.data.success) {
      messages.value.push({
        content: response.data.message.content,
        file: fileUrl,
        type: 'sent',
        senderName: response.data.message.senderName,
        createdAt: response.data.message.createdAt,
        messageType: response.data.message.messageType
      });
      // updateLastMessage(selectedGroupId.value, response.data.message.content);
      message.value = '';  // Xóa nội dung message input sau khi gửi
      nextTick(scrollToBottom);  // Cuộn xuống cuối chat
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Lấy danh sách nhóm khi component được mounted
onMounted(() => {
  fetchGroups();
  window.Echo.channel('chat-group')
    .listen('.message-group.sent', (e) => {
      // Chỉ xử lý nếu là group đang được chọn và tin nhắn từ người khác
      if (e.sender_id !== userId.value && e.group_id === selectedGroupId.value) {
        messages.value.push({
          content: e.message,
          type: 'received',
          senderName: e.senderName,
          createdAt: e.created_at,
          messageType: e.messageType,
          file: e.file_Path, // bạn dùng filePath nhưng nên đồng nhất với các phần còn lại
        });

        nextTick(() => {
          scrollToBottom();
          handleScroll();
        });
      }
    });

});





// API call để lấy danh sách thành viên
async function fetchUsers(query) {
  try {
    const response = await api.get('/search-users', { params: { keyword: query } });
    users.value = response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}



// Watch searchQuery và gọi API sau khi người dùng dừng gõ
watch(searchQuery, (newQuery) => {
  if (newQuery) {
    debouncedFetchUsers(newQuery); // Gọi hàm fetchUsers với debounce
  } else {
    users.value = []; // Clear users nếu không có kết quả tìm kiếm
  }
  // Watch khi có tin nhắn mới thì scroll xuống

});

watch(messages, async () => {
  await nextTick();
  scrollToBottom();
});

watch(() => selectedGroup.name, async (newVal, oldVal) => {
  if (oldVal && !newVal) {
    cleanupEventListeners();
  }

  if (newVal) {
    await nextTick();
    setupEventListeners();
    scrollToBottom();
  }
});


onBeforeUnmount(() => {
  // window.removeEventListener('resize', checkMobile);
  cleanupEventListeners();
  // if (statusInterval) clearInterval(statusInterval);
});

function openCreateGroupModal() {
  selectedMembers.value = [];
  searchQuery.value = ''; // reset search query

  Modal.confirm({
    title: 'Tạo nhóm mới',
    width: 500,
    icon: h(UsergroupAddOutlined, { style: { fontSize: '24px', color: '#3f51b5' } }),
    content: () =>
      h('div', [
        // Thanh tìm kiếm thành viên
        h(Input, {
          value: searchQuery.value,
          'onUpdate:value': val => (searchQuery.value = val),
          placeholder: 'Tìm thành viên...',
          allowClear: true,
          prefix: h(SearchOutlined),
          style: { marginBottom: '16px' },
        }),

        // Hàng chứa avatar + tên nhóm
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '16px' } }, [
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
              style: { display: 'inline-block', padding: '8px 12px', backgroundColor: '#3f51b5', color: 'white', borderRadius: '12px', cursor: 'pointer' }
            }, 'Chọn ảnh'),
            avatarUrl.value &&
            h('img', {
              src: avatarUrl.value,
              style: { width: '48px', height: '48px', marginTop: '8px', borderRadius: '50%', objectFit: 'cover' },
            }),
          ]),

          // Nhập tên nhóm
          h(Input, {
            value: newGroupName.value,
            'onUpdate:value': val => (newGroupName.value = val),
            placeholder: 'Nhập tên nhóm...',
            allowClear: true,
            style: { flexGrow: 1, marginTop: '26px' },
          }),
        ]),

        h('div', { style: 'font-weight: 500; margin-bottom: 8px' }, 'Chọn thành viên:'),

        // Danh sách thành viên với avatar và cuộn khi dài
        h('div', { style: { maxHeight: '200px', overflowY: 'auto' } },
          users.value.map(user =>
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
                  style: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' },
                }),
                h('span', {}, user.name)
              ]))
          )
        ),

        // Hiển thị danh sách thành viên đã chọn bên dưới
        selectedMembers.value.length > 0 &&
        h('div', { style: { marginTop: '16px', fontWeight: '500' } }, 'Thành viên đã chọn:'),
        selectedMembers.value.length > 0 &&
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' } },
          selectedMembers.value.map(id => {
            const user = users.value.find(u => u.id === id);
            return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              h('img', {
                src: user.avatar,
                style: { width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' },
              }),
              h('span', {}, user.name)
            ]);
          })
        ),
      ]),

    zIndex: 2000,
    okText: 'Tạo nhóm',
    cancelText: 'Hủy',
    onOk() {
      try {
        createGroupSchema.validateSync({
          name: newGroupName.value,
          // avatar: avatarUrl.value,
          members: selectedMembers.value,
        });

        // console.log('Validation passed', newGroupName.value, selectedMembers.value);

        // Gọi API
        api.post('/create-group', {
          admin: userId.value,
          name: newGroupName.value,
          // avatar: avatarUrl.value,
          members: selectedMembers.value,

        }).then(response => {
          Modal.success({
            title: 'Tạo nhóm thành công',
            content: `Nhóm "${newGroupName.value}" đã được tạo.`,
            zIndex: 2000,
          });

          // Reset sau khi tạo nhóm
          newGroupName.value = '';
          selectedMembers.value = [];
          // avatarUrl.value = '';

          // Có thể cập nhật lại danh sách nhóm ở đây nếu muốn
          fetchGroups();

        }).catch(error => {
          Modal.error({
            title: 'Lỗi tạo nhóm',
            content: error.response?.data?.message || 'Có lỗi xảy ra khi tạo nhóm.',
            zIndex: 2000,
          });
        });

      } catch (error) {
        Modal.error({
          title: 'Lỗi tạo nhóm',
          content: error.message,
          zIndex: 2000,
        });
      }
    }


  });
}
</script>


<style scoped>
.scroll-to-bottom {
  position: absolute;
  bottom: 80px;
  right: 24px;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

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
  /* background-color: #fff; */
  flex-shrink: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* background-color: #fafafa; */
  scroll-behavior: auto;
}

.chat-input-bar {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #eee;
  /* background-color: #fff; */
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

.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.message-wrapper.sent .message-bubble {
  /* background-color: #d1e7dd; */
  align-self: flex-end;
}

.message-wrapper.received .message-bubble {
  /* background-color: #fff; */
  align-self: flex-start;
}

.message-bubble {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  max-width: 80%;
  word-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sent {
  align-items: flex-end;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.sent .message-bubble {
  background-color: #DCF8C6;
  color: #000;
}

.received {
  align-items: flex-start;
}

.received .message-bubble {
  background-color: #f1f1f1;
  color: #000;
}

.sender-name {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.chat-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 5px;
}


.welcome-message {
  height: 100%;
  color: #555;
  animation: fadeIn 0.6s ease-in-out;
}

.welcome-message-out {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
