declare module "discordie" {
    import * as events from "events";
    import * as stream from "stream";

    class VoiceConnectionInfo {
        gatewaySocket;
        voiceSocket;
        public voiceConnection: Discordie.IVoiceConnection;
    }

    class GatewayReconnectHandler {
        /**
         * Boolean indicating whether auto-reconnect is enabled.
         */
        public enabled: boolean;
        /**
         * Gets/sets minimum delay in milliseconds. Must be >= 0.
         * Default is 1000.
         */
        public min: number;
        /**
         * Gets/sets maximum delay in milliseconds. Must be >= 5000.
         * Default is 60000.
         */
        public max: number;

        /**
         * Enables auto-reconnect.
         */
        enable();
        /**
         * Disables auto-reconnect.
         */
        disable();
    }

    interface DisconnectedEvent {
        error: Error;
        /**
         * Only present (and set to true) when auto-reconnect is enabled.
         */
        autoReconnect: boolean;
        /**
         * Delay in milliseconds until next reconnect attempt. Only present when auto-reconnect is enabled.
         */
        delay: number;
    }

    interface GatewayReadyResumedEvent {
        /**
         * GatewaySocket
         */
        socket;
        /**
         * Raw event data
         */
        data: any;
    }

    interface VoiceConnectedEvent {
        socket;
        voiceConnection: Discordie.IVoiceConnection;
    }

    interface VoiceDisconnectedEvent {
        socket;
        voiceConnection: Discordie.IVoiceConnection;
        error: Error;
        /**
         * Indicating whether was caused by IVoiceChannel.leave() or Discordie.disconnect(), also true if channel/guild has been deleted
         */
        manual: boolean;
        /**
         * Indicates whether there is a reconnect pending, reconnects can occur when Discord decides to move users to another voice server
         */
        endpointAwait: Promise<VoiceConnectionInfo>;
    }

    interface GuildUnavailableEvent {
        socket;
        guildId: string;
    }

    interface CallUnavailableEvent {
        socket;
        channelId: string;
    }

    interface CallRingEvent {
        socket;
        channel: Discordie.IDirectMessageChannel;
    }

    interface PresenceMemberInfoUpdateEvent {
        socket;
        /**
         * Old instance of internal User model (immutable)
         */
        old: any;
        /**
         * New instance of internal User model (immutable)
         */
        new: any;
    }

    interface VoiceChannelLeaveEvent {
        socket;
        user: Discordie.IUser;
        channel: Discordie.IChannel;
        channelId: string;
        guildId: string;
        /**
         * Next channel id if user moved to another channel
         */
        newChannelId: string;
        /**
         * Next guild id if user moved to another channel
         */
        newGuildId: string;
    }

    interface VoiceChannelJoinEvent {
        socket;
        user: Discordie.IUser;
        channel: Discordie.IChannel;
        channelId: string;
        guildId: string;
    }

    interface VoiceUserSelfMuteEvent {
        socket;
        user: Discordie.IUser;
        channel: Discordie.IChannel;
        channelId: string;
        guildId: string;
        /**
         * Current state (is self muted)
         */
        state: boolean;
    }

    interface VoiceUserSelfDeafEvent {
        socket;
        user: Discordie.IUser;
        channel: Discordie.IChannel;
        channelId: string;
        guildId: string;
        /**
         * Current state (is self deafened)
         */
        state: boolean;
    }

    interface VoiceUserMuteEvent {
        socket;
        user: Discordie.IUser;
        channel: Discordie.IChannel;
        channelId: string;
        guildId: string;
        /**
         * Current state (is muted globally)
         */
        state: boolean;
    }

    interface VoiceUserDeafEvent {
        socket;
        user: Discordie.IUser;
        channel: Discordie.IChannel;
        channelId: string;
        guildId: string;
        /**
         * Current state (is deafened globally)
         */
        state: boolean;
    }

    interface MessageCreateEvent {
        socket;
        message: Discordie.IMessage;
    }

    interface MessageDeleteEvent {
        socket;
        channelId: string;
        messageId: string;
        message: Discordie.IMessage;
    }

    interface MessageDeleteBulkEvent {
        socket;
        channelId: string;
        messageIds: string[];
        /**
         * Array of known deleted messages, can be empty
         */
        messages: Discordie.IMessage[];
    }

    interface MessageUpdateEvent {
        socket;
        message: Discordie.IMessage;
        /**
         * Raw message object received from server
         */
        data: any;
    }

    interface PresenceUpdateEvent {
        socket;
        guild: Discordie.IGuild;
        user: Discordie.IUser;
        member: Discordie.IGuildMember | Discordie.IUser;
    }

    interface TypingStartEvent {
        socket;
        user: Discordie.IUser;
        /**
         * Unix timestamp
         */
        timestamp: number;
        channel: Discordie.IChannel;
    }

    interface ChannelCreateEvent {
        socket;
        channel: Discordie.IChannel;
    }

    interface ChannelDeleteEvent {
        socket;
        channelId: string;
        /**
         * Raw channel object received from server
         */
        data: any;
    }

    interface ChannelUpdateEvent {
        socket;
        channel: Discordie.IChannel;
        /**
         * Function returning an object {before: ..., after: ...} containing two raw channel objects.
         */
        getChanges(): { before: Discordie.IChannel; after: Discordie.IChannel; }
    }

    interface ChannelRecipientAddEvent {
        socket;
        channel: Discordie.IDirectMessageChannel;
        user: Discordie.IUser;
    }

    interface ChannelRecipientRemoveEvent {
        socket;
        channel: Discordie.IDirectMessageChannel;
        user: Discordie.IUser;
    }

    interface GuildCreateEvent {
        socket;
        guild: Discordie.IGuild;
        /**
         * Indicates whether the guild has recovered from unavailable state
         */
        becameAvailable: boolean;
    }

    interface GuildDeleteEvent {
        socket;
        guildId: string;
        /**
         * Raw guild object received from server
         */
        data: any;
        /**
         * Function returning a raw guild object or null.
         */
        getCachedData(): Discordie.IGuild;
    }

    interface GuildUpdateEvent {
        socket;
        guild: Discordie.IGuild;
        /**
         * Function returning an object {before: ..., after: ...} containing two raw guild objects.
         */
        getChanges(): { before: Discordie.IGuild; after: Discordie.IGuild; };
    }

    interface GuildMemberAddEvent {
        socket;
        guild: Discordie.IGuild;
        member: Discordie.IGuildMember;
    }

    interface GuildMemberRemoveEvent {
        socket;
        guild: Discordie.IGuild;
        user: Discordie.IUser;
        /**
         * Raw data received from server
         */
        data: any;
        /**
         * Function returning a raw member object or null.
         */
        getCachedData(): Discordie.IGuildMember;
    }

    interface GuildMemberUpdateEvent {
        socket;
        guild: Discordie.IGuild;
        member: Discordie.IGuildMember;
        rolesAdded: Discordie.IRole[];
        rolesRemoved: Discordie.IRole[];
        previousNick: string;
        /**
         * Function returning an object {before: ..., after: ...} containing two raw member objects.
         */
        getChanges(): { before: Discordie.IGuildMember; after: Discordie.IGuildMember; };
    }

    interface GuildBanAddEvent {
        socket;
        guild: Discordie.IGuild;
        user: Discordie.IUser;
    }

    interface GuildBanRemoveEvent {
        socket;
        guild: Discordie.IGuild;
        user: Discordie.IUser;
    }

    interface GuildRoleCreateEvent {
        socket;
        guild: Discordie.IGuild;
        role: Discordie.IRole;
    }

    interface GuildRoleUpdateEvent {
        socket;
        guild: Discordie.IGuild;
        role: Discordie.IRole;
        /**
         * Function returning an object {before: ..., after: ...} containing two raw role objects.
         */
        getChanges(): { before: Discordie.IRole; after: Discordie.IRole; };
    }

    interface GuildRoleDeleteEvent {
        socket;
        guild: Discordie.IGuild;
        roleId: String;
        /**
         * Function returning a raw role object or null.
         */
        getCachedData(): any;
    }

    interface GuildEmojisUpdateEvent {
        socket;
        guild: Discordie.IGuild;
        /**
         * Function returning an object {before: ..., after: ...} containing two full emoji arrays in format provided by Discord.
         */
        getChanges(): { before: any[]; after: any[]; };
    }

    interface CallCreateEvent {
        socket;
        channel: Discordie.IDirectMessageChannel;
        call: Discordie.ICall;
    }

    interface CallDeleteEvent {
        socket;
        channelId: string;
        /**
         * Raw object received from server
         */
        data: any;
    }

    interface CallUpdateEvent {
        socket;
        channel: Discordie.IDirectMessageChannel;
        call: Discordie.ICall;
    }

    interface WebhooksUpdateEvent {
        socket;
        guild: Discordie.IGuild;
        channel: Discordie.IChannel;
        /**
         * Raw object received from server
         */
        data: any;
    }

    interface DiscordieDispatcher extends events.EventEmitter {
        /**
         * Emitted when login or gateway auth failed, or primary gateway socket disconnects, closing all open sockets.
         * 
         * Not emitted if disconnected using client.disconnect().
         */
        on(event: "DISCONNECTED", cb: (e: DisconnectedEvent) => void);
        /**
         * Emitted when the Discordie instance is ready to use.
         * All objects except unavailable guilds and offline members of large guilds (250+ members) will be in cache when this event fires.
         * You can request offline members using client.Users.fetchMembers(). See documentation for IUserCollection.fetchMembers.
         */
        on(event: "GATEWAY_READY", cb: (e: GatewayReadyResumedEvent) => void);
        /**
         * Emitted after gateway connection is resumed after a disconnect.
         * Connections can be resumable if disconnected for short period of time.
         * Does not clear cache unlike GATEWAY_READY.
         */
        on(event: "GATEWAY_RESUMED", cb: (e: GatewayReadyResumedEvent) => void);
        /**
         * Emitted when a new voice connection is fully initialized.
         */
        on(event: "VOICE_CONNECTED", cb: (e: VoiceConnectedEvent) => void);
        /**
         * Emitted when a voice socket disconnects.
         */
        on(event: "VOICE_DISCONNECTED", cb: (e: VoiceDisconnectedEvent) => void);
        /**
         * Emitted when guild becomes unavailable. Guild is deleted from cache until another GUILD_CREATE.
         */
        on(event: "GUILD_UNAVAILABLE", cb: (e: GuildUnavailableEvent) => void);
        /**
         * Emitted when call becomes unavailable.
         */
        on(event: "CALL_UNAVAILABLE", cb: (e: CallUnavailableEvent) => void);
        /**
         * Emitted when current user is being rung in a call.
         */
        on(event: "CALL_RING", cb: (e: CallRingEvent) => void);
        /**
         * Emitted when username, avatar or discriminator difference detected in an incoming PRESENCE_UPDATE event.
         */
        on(event: "PRESENCE_MEMBER_INFO_UPDATE", cb: (e: PresenceMemberInfoUpdateEvent) => void);
        /**
         * Emitted when user leaves voice channel. Fields newChannelId/newGuildId contain ids that will appear in VOICE_CHANNEL_JOIN event that will follow if user has moved to another channel, otherwise null.
         */
        on(event: "VOICE_CHANNEL_LEAVE", cb: (e: VoiceChannelLeaveEvent) => void);
        /**
         * Emitted when user joins voice channel.
         */
        on(event: "VOICE_CHANNEL_JOIN", cb: (e: VoiceChannelJoinEvent) => void);
        /**
         * Emitted when user self mute change is detected. Manual client-side mute.
         */
        on(event: "VOICE_USER_SELF_MUTE", cb: (e: VoiceUserSelfMuteEvent) => void);
        /**
         * Emitted when user self deaf change is detected. Manual client-side deafen.
         */
        on(event: "VOICE_USER_SELF_DEAF", cb: (e: VoiceUserSelfDeafEvent) => void);
        /**
         * Emitted when user mute change is detected. Global server-side mute.
         */
        on(event: "VOICE_USER_MUTE", cb: (e: VoiceUserMuteEvent) => void);
        /**
         * Emitted when user deaf change is detected. Global server-side deafen.
         */
        on(event: "VOICE_USER_DEAF", cb: (e: VoiceUserDeafEvent) => void);
        on(event: "MESSAGE_CREATE", cb: (e: MessageCreateEvent) => void);
        /**
         * Emitted when user deletes their message. Contains null message if not cached.
         */
        on(event: "MESSAGE_DELETE", cb: (e: MessageDeleteEvent) => void);
        /**
         * Emitted when a bot deletes more than 1 message at once.
         */
        on(event: "MESSAGE_DELETE_BULK", cb: (e: MessageDeleteBulkEvent) => void);
        /**
         * Emitted when user updates their message. Contains null message if not cached.
         */
        on(event: "MESSAGE_UPDATE", cb: (e: MessageUpdateEvent) => void);
        /**
         * Emitted when on changes for username, avatar, status or game.
         * Emitted multiple times for each shared guild with the local user and the user presence is for.
         * Compare user.status and user.previousStatus to detect status changes.
         * Games can be checked with user.game and user.previousGame (and helpers for names user.gameName and user.previousGameName) respectively.
         ** Note: Property member will contain IUser instance if user has left the guild.
         */
        on(event: "PRESENCE_UPDATE", cb: (e: PresenceUpdateEvent) => void);
        on(event: "TYPING_START", cb: (e: TypingStartEvent) => void);
        on(event: "CHANNEL_CREATE", cb: (e: ChannelCreateEvent) => void);
        on(event: "CHANNEL_DELETE", cb: (e: ChannelDeleteEvent) => void);
        on(event: "CHANNEL_UPDATE", cb: (e: ChannelUpdateEvent) => void);
        /**
         * Emitted when a user has been added to a group dm.
         */
        on(event: "CHANNEL_RECIPIENT_ADD", cb: (e: ChannelRecipientAddEvent) => void);
        /**
         * Emitted when a user has been removed or left from a group dm.
         */
        on(event: "CHANNEL_RECIPIENT_REMOVE", cb: (e: ChannelRecipientRemoveEvent) => void);
        on(event: "GUILD_CREATE", cb: (e: GuildCreateEvent) => void);
        on(event: "GUILD_DELETE", cb: (e: GuildDeleteEvent) => void);
        on(event: "GUILD_UPDATE", cb: (e: GuildUpdateEvent) => void);
        on(event: "GUILD_MEMBER_ADD", cb: (e: GuildMemberAddEvent) => void);
        /**
         * Emitted when any other member of a joined guild leaves, events for self are blocked internally due to race condition between GUILD_DELETE and GUILD_MEMBER_REMOVE.
         */
        on(event: "GUILD_MEMBER_REMOVE", cb: (e: GuildMemberRemoveEvent) => void);
        on(event: "GUILD_MEMBER_UPDATE", cb: (e: GuildMemberUpdateEvent) => void);
        on(event: "GUILD_BAN_ADD", cb: (e: GuildBanAddEvent) => void);
        on(event: "GUILD_BAN_REMOVE", cb: (e: GuildBanRemoveEvent) => void);
        on(event: "GUILD_ROLE_CREATE", cb: (e: GuildRoleCreateEvent) => void);
        on(event: "GUILD_ROLE_UPDATE", cb: (e: GuildRoleUpdateEvent) => void);
        on(event: "GUILD_ROLE_DELETE", cb: (e: GuildRoleDeleteEvent) => void);
        on(event: "GUILD_EMOJIS_UPDATE", cb: (e: GuildEmojisUpdateEvent) => void);
        on(event: "CALL_CREATE", cb: (e: CallCreateEvent) => void);
        on(event: "CALL_DELETE", cb: (e: CallDeleteEvent) => void);
        on(event: "CALL_UPDATE", cb: (e: CallUpdateEvent) => void);
        /**
         * Emitted when a webhook is updated.
         */
        on(event: "WEBHOOKS_UPDATE", cb: (e: WebhooksUpdateEvent) => void);
    }

    class Discordie {
        /**
         * Primary event bus.
         */
        public Dispatcher: DiscordieDispatcher;
        /**
         * Represents current user.
         */
        public User: Discordie.IAuthenticatedUser;
        /**
         * Interface to a collection containing all "Discord Servers" (internally called guilds) current session is connected to. Does not contain unavailable guilds.
         */
        public Guilds: Discordie.IGuildCollection;
        /**
         * Interface to a collection containing all public channels current session is connected to.
         */
        public Channels: Discordie.IChannelCollection;
        /**
         * Interface to a collection containing all users current session has been exposed to.
         * Contains only online users after READY. See documentation for IUserCollection.fetchMembers(guilds) if you want to load offline members too.
         */
        public Users: Discordie.IUserCollection;
        /**
         * Interface to a collection containing all private (direct message) channels current session is connected to.
         */
        public DirectMessageChannels: Discordie.IDirectMessageChannelCollection;
        /**
         * Interface to a collection containing all cached messages.
         */
        public Messages: Discordie.IMessageCollection;
        /**
         * An instance of IInviteManager.
         */
        public Invites: Discordie.IInviteManager;
        /**
         * An instance of IWebhookManager.
         */
        public Webhooks: Discordie.IWebhookManager;
        /**
         * An array of VoiceConnectionInfo.
         */
        public VoiceConnections: VoiceConnectionInfo[];
        /**
         * An array of unavailable guild's ids.
         */
        public UnavailableGuilds: string[];
        /**
         * Auto-reconnect handler.
         */
        public autoReconnect: GatewayReconnectHandler;
        /**
         * Current state.
         */
        public state: string;
        /**
         * Gets a value indicating whether the gateway websocket connection is established.
         */
        public connected: boolean;

        connect(credentials: { email?: string; password?: string; token?: string });
        /**
         * Disconnects primary gateway websocket.
         */
        disconnect();
    }

    interface InitializeOptions {
        frameDuration?: number;
        sampleRate?: number;
        channels?: number;
        float?: number;
        downmix?: number;
        engine?: string;
        proxy?: boolean;
        bitrate?: number;
    }

    class AudioEncoder {
        /**
         * Override this function to be called when encoder needs data.
         * Note: This function WILL NOT be called if an AudioEncoderStream instance is piping data into the encoder on the same voice connection to avoid buffer interleaving.
         */
        public onNeedBuffer: Function;
        /**
         * Checks worker state: returns true if not initialized.
         */
        public disposed: boolean;

        /**
         * Initializes worker object.
         */
        initialize(options: InitializeOptions);
        /**
         * Sets volume. Does not apply in proxy mode.
         */
        setVolume(volume: number);
        /**
         * Sets bitrate. Does not apply in proxy mode.
         */
        setBitrate(bitrate: number);
        /**
         * Enqueues audio (PCM or Opus packet (proxy mode), depending on options) to the queue buffer.
         */
        enqueue(chunk: Buffer, sampleCount: number);
        /**
         * Enqueues an array of audio chunks (PCM or Opus packet (proxy mode), depending on options) to the queue buffer.
         * All chunks should have the same sampleCount.
         */
        enqueueMultiple(chunks: Buffer[], sampleCount: number);
        /**
         * Clears audio queue.
         */
        clearQueue();
        /**
         * Shuts down the worker.
         */
        kill();
    }

    class FFmpegEncoder {
        /**
         * Gets stdin.
         */
        public stdin: stream.Writable;
        /**
         * Gets the voice connection this instance is bound to.
         */
        public voiceConnection: Discordie.IVoiceConnection;

        /**
         * Connects pipe into AudioEncoderStream of the bound voice connection.
         * This function handles automatic unpiping and kills process. The stream will become disposed and no longer playable after calling unpipe() or stop().
         * Use pipe() method if you want to control the process manually and destroy() it later.
         */
        play(): AudioEncoderStream;
        /**
         * Unpipes internal stream from the bound voice connection.
         */
        stop();
        /**
         * Pipes stream into destination.
         * Note: In case of manual piping you have to invoke IVoiceConnection.getEncoderStream with the correct settings yourself. For proxy (externally encoding) streams only {proxy: true} is required.
         */
        pipe(dest: stream.Writable);
        /**
         * Unpipes stream from destination.
         */
        unpipe(dest: stream.Writable);
        /**
         * Destroys all handles, releases resources and disposes this instance.
         */
        destroy();
    }

    class OggOpusPlayer {
        /**
         * Gets the voice connection this instance is bound to.
         */
        public voiceConnection: Discordie.IVoiceConnection;

        /**
         * Connects pipe into AudioEncoderStream of the bound voice connection.
         * This function handles automatic unpiping and kills process. The stream will become disposed and no longer playable after calling unpipe() or stop().
         * Use pipe() method if you want to control the process manually and destroy() it later.
         */
        play(): AudioEncoderStream;
        /**
         * Unpipes internal stream from the bound voice connection.
         */
        stop();
        /**
         * Pipes stream into destination.
         * Note: In case of manual piping you have to invoke IVoiceConnection.getEncoderStream with the correct settings yourself. For proxy (externally encoding) streams only {proxy: true} is required.
         */
        pipe(dest: stream.Writable);
        /**
         * Unpipes stream from destination.
         */
        unpipe(dest: stream.Writable);
        /**
         * Destroys all handles, releases resources and disposes this instance.
         */
        destroy();
    }

    class WebmOpusPlayer {
        /**
         * Gets the voice connection this instance is bound to.
         */
        public voiceConnection: Discordie.IVoiceConnection;

        /**
         * Connects pipe into AudioEncoderStream of the bound voice connection.
         * This function handles automatic unpiping and kills process. The stream will become disposed and no longer playable after calling unpipe() or stop().
         * Use pipe() method if you want to control the process manually and destroy() it later.
         */
        play(): AudioEncoderStream;
        /**
         * Unpipes internal stream from the bound voice connection.
         */
        stop();
        /**
         * Pipes stream into destination.
         * Note: In case of manual piping you have to invoke IVoiceConnection.getEncoderStream with the correct settings yourself. For proxy (externally encoding) streams only {proxy: true} is required.
         */
        pipe(dest: stream.Writable);
        /**
         * Unpipes stream from destination.
         */
        unpipe(dest: stream.Writable);
        /**
         * Destroys all handles, releases resources and disposes this instance.
         */
        destroy();
    }

    class AudioEncoderStream {
        /**
         * Current timestamp in seconds.
         * Increments when a chunk is processed.
         */
        public timestamp: number;

        /**
         * Resets current timestamp.
         */
        resetTimestamp();
        /**
         * Unpipes the connected stream if piped.
         */
        unpipeAll();
    }



    namespace Discordie {
        interface IAuthenticatedUser {
            id: String;
            username: String;
            discriminator: String;
            email: String;
            verified: boolean;
            status: String;
            avatar: String;
            token: String;
            bot: boolean;
            mfa_enabled: boolean;
            game: any;
            afk: boolean;

            /**
             * Gets date and time the account was registered (created) at.
             */
            registeredAt: Date;
            /**
             * Gets current avatar URL.
             */
            avatarURL: String;
            /**
             * Gets a value indicating whether the account is claimed.
             */
            isClaimedAccount: boolean;
            /**
             * Name of the game current user is playing.
             */
            gameName: String;
            /**
             * Creates a mention from this user's id.
             */
            mention: String;
            /**
             * Creates a nickname mention from this user's id.
             */
            nickMention: String;
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;
        }

        interface ICall {
            channel_id: String;
            message_id: String;
            region: String;
            unavailable: boolean;

            /**
             * Gets date and time this call was created at.
             */
            createdAt: Date;
            /**
             * Checks if the call is ringing for current user.
             */
            isRinging: boolean;
            ringing: IUser[];
        }

        interface InviteOptions {
            /** 
             * Time in seconds
             */
            max_age?: number;
            max_uses?: number;
            temporary?: boolean;
        }

        interface IInvite {
            max_age: number;
            code: string;

            guild: {
                splash_hash: string | null; 
                id: string;
                name: string;
            };

            revoked: boolean;
            created_at: string;
            temporary: boolean;
            uses: number;
            max_uses: number;
            
            inviter: {
                username: string;
                discriminator: string;
                bot: boolean;
                id: string;
                avatar: string | Buffer;
            };

            channel: {
                type: string;
                id: string;
                name: string;
            };
        }

        interface IChannel {
            id: String;
            name: String;
            topic: String;
            position: Number;
            type: Number;
            guild_id: String;
            recipients: Set<IUser>;
            permission_overwrites: IPermissionOverwrite[];
            bitrate: Number;
            user_limit: Number;
            owner_id: String;
            icon: String;

            /**
             * Removed in API v6. Use isPrivate instead.
             */
            is_private: boolean;
            /**
             * Checks whether this channel is a direct message channel or a group.
             */
            isPrivate: boolean;
            /**
             * Gets guild of this channel.
             */
            guild: IGuild;
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;

            /**
             * Makes a request to create an invite for this channel.
             */
            createInvite(options: InviteOptions): Promise<IInvite>;
            /**
             * Makes a request to create a permission overwrite for this channel.
             */
            createPermissionOverwrite(roleOrMember: IAuthenticatedUser | IRole | IGuildMember, allow?: IPermissions | number, deny?: IPermissions | number): Promise<IPermissionOverwrite>;
            /**
             * Makes a request to update this channel.
             */
            update(name?: string, topic?: string, bitrate?: number, userLimit?: number): Promise<IChannel>;
            /**
             * Makes a request to create a new channel with permission overwrites of this channel.
             */
            clone(name: string, type?: number, bitrate?: number, userLimit?: number);
            /**
             * Moves this channel to position and makes a batch channel update request.
             */
            setPosition(position: number): Promise<void>;
            /**
             * Makes a request to delete this channel.
             */
            delete(): Promise<void>;
            /**
             * Makes a request to get a list of invites for this channel.
             */
            getInvites(): Promise<any[]>;
        }

        interface IChannelCollection {
            /**
             * Number of elements in this collection.
             */
            length: Number;
            /**
             * Number of elements in this collection. Alias for .length.
             */
            size: Number;

            /**
             * Creates an array of IChannel (ITextChannel and IVoiceChannel) for guild.
             */
            forGuild(guild: IGuild): IChannel[];
            /**
             * Creates an array of ITextChannel for guild.
             */
            textForGuild(guild: IGuild): ITextChannel[];
            /**
             * Creates an array of IVoiceChannel for guild.
             */
            voiceForGuild(guild: IGuild): IVoiceChannel[];
            /**
             * Returns an an element, if key of an element in the collection with exact value can be found. Otherwise null is returned.
             */
            getBy(key: string, value): IChannel;
            /**
             * Returns an element with requested id, if exists in the collection. Otherwise null is returned.
             */
            get(id: string): IChannel;
            /**
             * Creates a new array with all elements that pass the test implemented by the provided function.
             */
            filter(fn: (c: IChannel) => boolean): IChannel[];
            /**
             * Returns a value in the collection, if an element in the collection satisfies the provided testing function. Otherwise null is returned.
             */
            find(fn: (c: IChannel) => boolean): any;
            /**
             * Executes a provided function once per element.
             */
            forEach(fn: () => IChannel);
            /**
             * Creates a new array with the results of calling a provided function on every element in this collection.
             */
            map<T>(fn: (c: IChannel) => T): T[]
            /**
             * Creates a new array with elements of this collection.
             */
            toArray(): IChannel[];
        }

        interface FetchMessagesResult {
            messages: IMessage[];
            limit: number;
            before: string;
            after: string;
        }

        interface FetchPinnedResult {
            channelId: string;
            messages: IMessage[];
        }

        interface IDirectMessageChannel {
            id: String;
            name: String;
            topic: String;
            position: Number;
            type: Number;
            guild_id: String;
            permission_overwrites: any[];
            bitrate: Number;
            user_limit: Number;
            owner_id: String;
            icon: String;

            /**
             * Deprecated: Removed in API v6. Use isPrivate instead.
             */
            is_private: boolean;
            /**
             * Checks whether this channel is a direct message channel or a group.
             */
            isPrivate: boolean;
            /**
             * Returns the owner of the private channel.
             * Returns null if the owner user is not in cache or there is no owner.
             */
            owner: IAuthenticatedUser | IUser;
            /**
             * Creates a string URL of image icon of this channel.
             */
            iconURL: String;
            /**
             * Gets first recipient of this channel.
             * Returns null if this channel is invalid or has no recipients.
             * * Deprecated: Use recipients instead.
             */
            recipient: IUser;
            /**
             * Gets a value indicating whether all messages were loaded.
             */
            allMessagesLoaded: boolean;
            /**
             * Creates an array of cached messages in this channel, sorted in order of arrival (message cache is sorted on message insertion, not when this getter is invoked).
             * Returns an empty array if channel no longer exists.
             */
            messages: IMessage[];
            /**
             * Creates an array of cached pinned messages in this channel.
             * Pinned message cache is updated only if all pinned messages have been loaded with IDirectMessageChannel.fetchPinned().
             * Returns an empty array if channel no longer exists or if pinned messages have not been fetched yet.
             */
            pinnedMessages: IMessage[];
            /**
             * Checks whether current user is in the call.
             */
            joinedCall: boolean;
            /**
             * Creates an array of users in the call.
             * Returns null if call does not exist in cache or has not started yet.
             */
            usersInCall: IUser[];
            /**
             * Gets call from cache.
             * Returns null if call does not exist in cache or has not started yet.
             */
            call: ICall;
            /**
             * Gets recipients of this channel.
             */
            recipients: IUser[];
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;

            /**
             * Checks whether the user is the owner of the private channel.
             */
            isOwner(user: IGuildMember | IUser | IAuthenticatedUser | string): boolean;
            /**
             * Makes a request to fetch messages for this channel.
             * Discord API does not allow fetching more than 100 messages at once.
             */
            fetchMessages(limit?: number, before?: IMessage | string, after?: IMessage | string): Promise<FetchMessagesResult>;
            /**
             * Makes a request to fetch pinned messages for this channel.
             */
            fetchPinned(): Promise<FetchPinnedResult>;
            /**
             * Makes a request to send a message to this channel. Messages over 2000 characters will be rejected by the server.
             * Use uploadFile if you want to send a message with an attachment.
             */
            sendMessage(content: string | string[], mentions?: IUser | IGuildMember | IUser[] | IGuildMember[], tts?: boolean): Promise<IMessage>;
            /**
             * Makes a request to upload data to this channel. Images require a filename with a valid extension to actually be uploaded.
             */
            uploadFile(readableStream: Buffer | NodeJS.ReadableStream | string, filename: string, content?: string, tts?: boolean): Promise<IMessage>;
            /**
             * Makes a request to send typing status for this channel.
             * Discord client displays it for 10 seconds, sends every 5 seconds. Stops showing typing status if receives a message from the user.
             */
            sendTyping(): Promise<void>;
            /**
             * Makes a request to close this channel (direct message channels only).
             */
            close(): Promise<void>;
            /**
             * Makes a request to ring specified recipients. Has no effect if call has not started yet.
             * Bot accounts cannot use this endpoint.
             */
            ring(recipients?: (IUser | string)[]): Promise<void>;
            /**
             * Makes a request to decline an incoming call (if no arguments passed) or stop ringing for specified recipients.
             * Bot accounts cannot use this endpoint.
             */
            stopRinging(recipients?: (IUser | string)[]): Promise<void>;
            /**
             * Makes a request to change the server region hosting the call.
             * Bot accounts cannot use this endpoint.
             */
            changeCallRegion(region: string): Promise<void>;
            /**
             * Makes a request to add a user to this private channel.
             * Bot accounts cannot use this endpoint.
             */
            addRecipient(user: IUser | IGuildMember): Promise<void>;
            /**
             * Makes a request to remove a user from this private channel.
             * Bot accounts cannot use this endpoint.
             */
            removeRecipient(user: IUser | IGuildMember): Promise<void>;
            /**
             * Makes a request to set a name for this private channel.
             */
            setName(name: string): Promise<IDirectMessageChannel>;
            /**
             * Makes a request to set an icon for this private channel.
             */
            setIcon(icon: string | Buffer): Promise<IDirectMessageChannel>;
            /**
             * Creates or joins a call. Only one call can be connected at the same time.
             * Joining calls with bot accounts is not supported.
             */
            joinCall(selfMute?: boolean, selfDeaf?: boolean): Promise<VoiceConnectionInfo>;
            /**
             * Leaves call if joined.
             */
            leaveCall();
            /**
             * Retrieves VoiceConnectionInfo for the call of this channel.
             */
            getVoiceConnectionInfo(): VoiceConnectionInfo;
            /**
             * Fetches call info through gateway socket.
             * Currently there are no ways to fetch call info for all channels at once.
             */
            fetchCall(): Promise<ICall>;
        }

        interface IDirectMessageChannelCollection {
            /**
             * Number of elements in this collection.
             */
            length: Number;
            /**
             * Number of elements in this collection. Alias for .length.
             */
            size: Number;

            /**
             * Gets a DM channel from cache or makes a request to create one.
             */
            getOrOpen(recipient: IUser | IGuildMember | string): Promise<IDirectMessageChannel>;
            /**
             * Makes a request to create a DM channel.
             */
            open(recipient: IUser | IGuildMember | string): Promise<IDirectMessageChannel>;
            /**
             * Makes a request to create a group DM channel.
             */
            createGroupDM(recipients?: (IUser | IGuildMember | string)[]): Promise<IDirectMessageChannel>;
            /**
             * Returns an an element, if key of an element in the collection with exact value can be found. Otherwise null is returned.
             */
            getBy(key, value): IDirectMessageChannel;
            /**
             * Returns an element with requested id, if exists in the collection. Otherwise null is returned.
             */
            get(id: string): IDirectMessageChannel;
            /**
             * Creates a new array with all elements that pass the test implemented by the provided function.
             */
            filter(fn: (d: IDirectMessageChannel) => boolean): IDirectMessageChannel[];
            /**
             * Returns a value in the collection, if an element in the collection satisfies the provided testing function. Otherwise null is returned.
             */
            find(fn: (d: IDirectMessageChannel) => boolean): IDirectMessageChannel;
            /**
             * Executes a provided function once per element.
             */
            forEach(fn: (d: IDirectMessageChannel) => void);
            /**
             * Creates a new array with the results of calling a provided function on every element in this collection.
             */
            map<T>(fn: (d: IDirectMessageChannel) => T): T[]
            /**
             * Creates a new array with elements of this collection.
             */
            toArray(): IDirectMessageChannel[];
        }

        interface Widget {
            enabled: boolean;
            channel_id: string;
        }

        interface IGuild {
            id: String;
            name: String;
            owner_id: String;
            icon: String;
            splash: String;
            features: Set<any>;
            emojis: any[];
            default_message_notifications: Number;
            afk_channel_id: String;
            afk_timeout: Number;
            verification_level: Number;
            region: String;
            member_count: Number;
            large: Boolean;
            mfa_level: Number;
            joined_at: String;

            /**
             * Creates an acronym string for this guild. (Text that shows up as guild icon in the client if there is no image icon.)
             */
            acronym: String;
            /**
             * Creates a string URL of image icon of this guild.
             */
            iconURL: String;
            /**
             * Creates a string URL of invite splash image of this guild.
             */
            splashURL: String;
            /**
             * Returns afk channel of this guild.
             */
            afk_channel: IChannel;
            /**
             * Returns the owner of this guild.
             * Returns null if the owner user is not in cache.
             * See .isOwner(user) if you want to safely check if the user is owner.
             */
            owner: IAuthenticatedUser | IUser;
            /**
             * Creates an array of text and voice channels of this guild.
             */
            channels: IChannel[];
            /**
             * Creates an array of text channels of this guild.
             */
            textChannels: ITextChannel[];
            /**
             * Creates an array of voice channels of this guild.
             */
            voiceChannels: IVoiceChannel[];
            /**
             * Returns general channel of this guild.
             */
            generalChannel: ITextChannel;
            /**
             * Creates an array containing members of this guild.
             */
            members: IGuildMember[];
            /**
             * Creates an array of roles of this guild.
             */
            roles: IRole[];
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;

            /**
             * Checks whether the user is the owner of this guild.
             */
            isOwner(user: IGuildMember | IUser | IAuthenticatedUser | string): boolean;
            /**
             * Makes a request to edit this guild, substituting undefined or null properties with current values.
             * Passing null in icon or afkChannelId will remove current icon/channel. Use undefined instead of null in this case.
             */
            edit(name?: string, icon?: string | Buffer, region?: string, afkChannelId?: IChannel | string,
                afkTimeout?: number, verificationLevel?: number, defaultMessageNotifications?: number): Promise<IGuild>;
            /**
             * Makes a request to create a channel in this guild.
             */
            createChannel(type: number, name: string, permissionOverwrites?: IPermissionOverwrite, bitrate?: number,
                userLimit?: number): Promise<ITextChannel | IVoiceChannel>;
            /**
             * Makes a request to create a role in this guild.
             */
            createRole(): Promise<IRole>;
            /**
             * Makes a request to create an invite for general channel in this guild.
             * See IChannel.createInvite for more info.
             */
            createInvite(options: InviteOptions): Promise<IInvite>;
            /**
             * Makes a request to delete this guild.
             * Returns a rejected promise if the user is not owner.
             */
            delete(): Promise<void>;
            /**
             * Makes a request to delete this guild.
             * Returns a rejected promise if the user is owner.
             */
            leave(): Promise<void>;
            /**
             * Makes a request to ban a user (does not have to be a member of the guild).
             * Additionally delete deleteMessageForDays number of days worth of their messages from all channels of the guild.
             */
            ban(user: IUser | string, deleteMessageForDays: number): Promise<void>;
            /**
             * Makes a request to unban a user.
             */
            unban(user: IUser | string): Promise<void>;
            /**
             * Makes a request to get ban list of this guild.
             */
            getBans(): Promise<IUser[]>;
            /**
             * Makes a request to get estimate of members affected by prune request.
             * Promise resolves with an Object with following structure:
             */
            getPruneEstimate(days: number): Promise<{ guildId: number; days: number; estimate: number; }>;
            /**
             * Makes a request to prune members.
             * Promise resolves with an Object with following structure:
             */
            pruneMembers(days: number): Promise<{ guildId: string; days: number; pruned: number; }>;
            /**
             * Makes a request to get a list of invites of this guild.
             */
            getInvites(): Promise<any[]>;
            /**
             * Makes a request to get a list of voice regions available for this guild.
             */
            fetchRegions(): Promise<any[]>;
            /**
             * Makes a request to transfer ownership of this guild to user.
             */
            transferOwnership(user: IGuildMember | IUser | string): Promise<IGuild>;
            /**
             * Makes a request to get widget (external embed) settings.
             * Promise resolves with an Object with following structure:
             */
            getWidget(): Promise<Widget>;
            /**
             * Makes a request to set widget (external embed) settings.
             */
            editWidget(options: Widget): Promise<Widget>;
            /**
             * Makes a request to fetch emojis for this guild.
             * Only user and whitelisted bot accounts can use this endpoint.
             * Promise resolves with an array of Objects with following structure:
             */
            fetchEmoji(): Promise<any[]>;
            /**
             * Makes a request to create an emoji.
             * Returned object does not contain user property.
             * Only user and whitelisted bot accounts can use this endpoint.
             */
            uploadEmoji(image: Buffer | string, name: string): Promise<any>;
            /**
             * Makes a request to delete the specified emoji.
             * Only user and whitelisted bot accounts can use this endpoint.
             */
            deleteEmoji(emoji: any | string): Promise<any>;
            /**
             * Makes a request to edit the specified emoji.
             * Returned object does not contain user property.
             * Only user and whitelisted bot accounts can use this endpoint.
             */
            editEmoji(emoji: any | string, options: { name: string; roles: string[]; }): Promise<any>;
            /**
             * Creates a string URL of an emoji.
             */
            getEmojiURL(): String;
        }

        interface IGuildCollection {
            /**
             * Number of elements in this collection.
             */
            length: Number;
            /**
             * Number of elements in this collection. Alias for .length.
             */
            size: Number;
            /**
             * Makes a request to create a guild.
             */
            create(name: string, region: string, icon?: Buffer, roles?: (IRole | any)[], channels?: (IChannel | any)[],
                verificationLevel?: number, defaultMessageNotifications?: number): Promise<IGuild>;
            /**
             * Makes a request to get a default list of voice regions. Use IGuild.fetchRegions for getting guild-specific list.
             */
            fetchRegions(): Promise<any[]>;
            /**
             * Returns an an element, if key of an element in the collection with exact value can be found. Otherwise null is returned.
             */
            getBy(key, value): IGuild;
            /**
             * Returns an element with requested id, if exists in the collection. Otherwise null is returned.
             */
            get(id: string): IGuild;
            /**
             * Creates a new array with all elements that pass the test implemented by the provided function.
             */
            filter(fn: (g: IGuild) => boolean): IGuild[];
            /**
             * Returns a value in the collection, if an element in the collection satisfies the provided testing function. Otherwise null is returned.
             */
            find(fn: (g: IGuild) => boolean): IGuild;
            /**
             * Executes a provided function once per element.
             */
            forEach(fn: (g: IGuild) => void);
            /**
             * Creates a new array with the results of calling a provided function on every element in this collection.
             */
            map<T>(fn: (g: IGuild) => T): T[];
            /**
             * Creates a new array with elements of this collection.
             */
            toArray(): IGuild[];
        }

        interface IGuildMember {
            id: String;
            guild_id: String;
            nick: String;
            mute: boolean;
            deaf: boolean;
            self_mute: boolean;
            self_deaf: boolean;
            joined_at: String;
            username: String;
            discriminator: String;
            avatar: String;
            bot: boolean;

            /**
             * Current status of the member.
             */
            status: String;
            /**
             * Current game the member is playing.
             */
            game: any;
            /**
             * Name of the current game the member is playing.
             */
            gameName: String;
            /**
             * Previous status of the member.
             */
            previousStatus: String;
            /**
             * Previous game the member was playing.
             */
            previousGame: any;
            /**
             * Name of the previous game the member was playing.
             */
            previousGameName: String;
            /**
             * Gets guild of this member.
             */
            guild: IGuild;
            /**
             * Gets nick of this member if set, otherwise returns username.
             */
            name: String;
            /**
             * Creates an array of roles assigned to this member.
             */
            roles: IRole[];
            /**
             * Gets date and time the account was registered (created) at.
             */
            registeredAt: Date;
            /**
             * Gets current avatar URL.
             */
            avatarURL: String;
            /**
             * Creates a mention from this user's id.
             */
            mention: String;
            /**
             * Creates a nickname mention from this user's id.
             */
            nickMention: String;
            /**
             * Returns true if this is a non-user bot object such as webhook-bot.
             */
            isWebhook: boolean;
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;

            /**
             * Gets the first voice channel that this member is currently in.
             */
            getVoiceChannel(): IVoiceChannel;
            /**
             * Makes a request to kick this member (from the guild they belong to).
             */
            kick(): Promise<void>;
            /**
             * Makes a request to ban this member (from the guild they belong to).
             * Additionally delete deleteMessageForDays number of days worth of their messages from all channels of the guild.
             */
            ban(deleteMessageForDays: number): Promise<void>;
            /**
             * Makes a request to unban this member (from the guild they belonged to).
             */
            unban(): Promise<void>;
            /**
             * Makes a request to mute this member globally in the guild.
             * Returns a resolved promise if the member is already muted.
             */
            serverMute(): Promise<void>;
            /**
             * Makes a request to unmute this member globally in the guild.
             * Returns a resolved promise if the member is already unmuted.
             */
            serverUnmute(): Promise<void>;
            /**
             * Makes a request to deafen this member globally in the guild.
             * Returns a resolved promise if the member is already deafened.
             */
            serverDeafen(): Promise<void>;
            /**
             * Makes a request to undeafen this member globally in the guild.
             * Returns a resolved promise if the member is already undeafened.
             */
            serverUndeafen(): Promise<void>;
            /**
             * Checks if this member has the specified role.
             */
            hasRole(role: IRole | string): Promise<void>;
            /**
             * Assigns (adds) the specified role to this member.
             */
            assignRole(role: IRole | string): Promise<void>;
            /**
             * Unassigns (removes) the specified role from this member.
             */
            unassignRole(role: IRole | string): Promise<void>;
            /**
             * Sets specified roles for this member: overwrites all existing roles with a new set of roles.
             */
            setRoles(roles: (IRole | string)[]): Promise<void>;
            /**
             * Moves this member to the specified voice channel.
             */
            setChannel(channel: IChannel | string): Promise<void>;
            /**
             * Makes a request to set a nickname for this member.
             * Requires permission MANAGE_NICKNAMES.
             */
            setNickname(nick: string): Promise<void>;
            /**
             * Checks whether the user is mentioned in a message.
             */
            isMentioned(message: IMessage, ignoreImplicitMentions: boolean): boolean;
            /**
             * Opens or gets existing Direct Message channel.
             */
            openDM(): Promise<IDirectMessageChannel>;
            /**
             * Attempts to get a guild member interface, returns null if this user is not a member of the guild or guild is not in cache.
             */
            memberOf(guild: IGuild): IGuildMember;
            /**
             * Resolves permissions for user in context.
             * Returns a helper object with getter boolean properties.
             */
            permissionsFor(context: IChannel | IGuild): IPermissions;
            /**
             * Resolves permissions for user in context and checks if user has permission.
             * See IUser.permissionsFor method for list of throwable errors.
             * See documentation of IPermissions for full list of possible permissions.
             */
            can(permission: number, context: IChannel | IGuild): boolean;
        }

        interface IInviteManager {
            /**
             * Makes a request to create an invite. See IChannel.createInvite for more info.
             */
            create(channel: IChannel | string, options: InviteOptions): Promise<IInvite>;
            /**
             * Makes a request to regenerate existing invite.
             */
            regenerate(code: any | string): Promise<any>;
            /**
             * Makes a request to revoke existing invite.
             */
            revoke(code: any | string): Promise<any>;
            /**
             * Makes a request to resolve existing invite.
             */
            resolve(code: any | string): Promise<any>;
            /**
             * * Deprecated: Only works with user accounts. Bot accounts can be invited by users with Manage Server permission using the https://discordapp.com/oauth2/authorize?client_id=%APP_ID%&scope=bot page. See official Discord API documentation for more info.
             * Makes a request to accept existing invite.
             */
            accept(code: any | string): Promise<any>;
        }

        interface IMessage {
            id: String;
            type: Number;
            channel_id: String;
            author: IUser;
            content: String;
            attachments: any[];
            embeds: any[];
            mentions: IUser[];
            mention_roles: IRole[];
            mention_everyone: boolean;
            tts: boolean;
            timestamp: String;
            edited_timestamp: String;
            nonce: String;
            webhook_id: String;
            pinned: boolean;
            deleted: boolean;

            /**
             * Checks whether this message is cached.
             */
            isCached: boolean;
            /**
             * Checks whether this message was edited by the author.
             * Returns null if message does not exist in cache.
             */
            isEdited: boolean;
            /**
             * Checks whether this message is from a private channel (direct message).
             * Returns null if message/channel does not exist in cache.
             */
            isPrivate: boolean;
            /**
             * Checks whether the message is a system message.
             */
            isSystem: boolean;
            /**
             * Generates a system message string depending on message type.
             */
            systemMessage: String;
            /**
             * Resolves username that should be displayed with this message.
             */
            displayUsername: String;
            /**
             * Gets channel of this message.
             * Returns null if message does not exist in cache.
             */
            channel: ITextChannel | IDirectMessageChannel;
            /**
             * Gets guild of this message.
             * Returns null if message does not exist in cache or from a private channel (direct message).
             */
            guild: IGuild;
            /**
             * Gets member instance of author.
             * Returns null for private channels, if message does not exist in cache, the author is no longer a member of the guild, or it is a webhook message.
             */
            member: IGuildMember;
            /**
             * Creates an array of all known (cached) versions of this message (including the latest). Sorted from latest (first) to oldest (last). Does not include embeds.
             */
            edits: IMessage[];
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;
            /**
             * Raw MessageCall object:
             */
            call: { participants: string[]; ended_timestamp: string };

            /**
             * Resolves user and channel references in content property to proper names. References that are not found in cache will be left as is and not resolved.
             * * Returns null if this message is not cached.
             */
            resolveContent(): string;
            /**
             * Makes a request to edit this message.
             * Editing of other users' messages is not allowed, server will send an Error Forbidden and returned promise will be rejected if you attempt to do so.
             * See IMessageCollection.editMessage if you are looking for a method that can operate on JSON or raw message id.
             */
            edit(content: string): Promise<IMessage>;
            /**
             * Makes a request to delete this message.
             * See IMessageCollection.deleteMessage if you are looking for a method that can operate on JSON or raw message id.
             */
            delete(): Promise<void>;
            /**
             * Makes a request to pin this message.
             * See IMessageCollection.pinMessage if you are looking for a method that can operate on JSON or raw message id.
             */
            pin(): Promise<IMessage>;
            /**
             * Makes a request to unpin this message.
             * See IMessageCollection.unpinMessage if you are looking for a method that can operate on JSON or raw message id.
             */
            unpin(): Promise<IMessage>;
            /**
             * Makes a request to send a reply to channel the message was from, prefixing content with author's mention in non-private channels.
             */
            reply(content: string | string[], mentions?: IUser | IGuildMember | IUser[] | IGuildMember[], tts?: boolean): Promise<IMessage>;
        }

        interface IMessageCollection {
            /**
             * Number of elements in this collection.
             */
            length: Number;
            /**
             * Number of elements in this collection. Alias for .length.
             */
            size: Number;

            /**
             * Creates an array of cached messages in channel, sorted in order of arrival (message cache is sorted on message insertion, not when this getter is invoked).
             * Returns an empty array if channel no longer exists.
             * * Note: Message cache also includes deleted messages. You can filter them by checking IMessage.deleted boolean.
             */
            forChannel(channel: IChannel | string): IMessage[];
            /**
             * Purges channel cache.
             */
            purgeChannelCache(channel: IChannel | string);
            /**
             * Creates an array of cached pinned messages in channel.
             * Pinned message cache is updated only if all pinned messages have been loaded with ITextChannel.fetchPinned().
             * Returns an empty array if channel no longer exists or if pinned messages have not been fetched yet.
             */
            forChannelPinned(channel: IChannel | string): IMessage[];
            /**
             * Purges pinned message cache for channel.
             */
            purgeChannelPinned(channel: IChannel | string);
            /**
             * Purges pinned message cache globally.
             */
            purgePinned();
            /**
             * Purges edits cache globall
             */
            purgeEdits();
            /**
             * Purges message cache globally.
             */
            purgeAllCache();
            /**
             * Gets channel message cache limit.
             */
            getChannelMessageLimit(channel: IChannel | string): Number;
            /**
             * Sets channel message cache limit (with a minimum of 1). Limit reverts to default when channel (or cache) is destroyed. Returns false if limit is invalid or channel does not exist.
             */
            setChannelMessageLimit(channel: IChannel | string, limit: number): Boolean;
            /**
             * Gets global message cache limit per channel.
             */
            getMessageLimit(): Number;
            /**
             * Sets global message cache limit per channel (with a minimum of 1). Does not affect channels with custom limits if new is lower than current.
             */
            setMessageLimit(limit: number);
            /**
             * Gets global edits cache limit per message.
             */
            getEditsLimit(): Number;
            /**
             * Sets global edits cache limit per message.
             */
            setEditsLimit(limit: number);
            /**
             * Makes a request to edit a message. Alternative method for editing messages that are not in cache.
             * Editing of other users' messages is not allowed, server will send an Error Forbidden and returned promise will be rejected if you attempt to do so.
             * Parameter messageId can be an object with fields {channel_id, id}, where id is a String message id, channel_id is a String channel id.
             * Parameter channelId is ignored when messageId is an object or an instance of IMessage.
             * Returns a promise that resolves to a JSON object of the edited message.
             */
            editMessage(content: string, messageId: IMessage | any | string, channelId: string): Promise<any>;
            /**
             * Makes a request to delete a message. Alternative method for deleting messages that are not in cache.
             * Parameter messageId can be an object with fields {channel_id, id}, where id is a String message id, channel_id is a String channel id.
             * Parameter channelId is ignored when messageId is an object or an instance of IMessage.
             */
            deleteMessage(messageId: IMessage | any | string, channelId: string): Promise<void>;
            /**
             * Makes a request to pin a message. Alternative method for pinning messages that are not in cache.
             */
            pinMessage(messageId: IMessage | any | string, channelId: string): Promise<void>;
            /**
             * Makes a request to unpin a message. Alternative method for unpinning messages that are not in cache.
             */
            unpinMessage(messageId: IMessage | any | string, channelId: string): Promise<void>;
            /**
             * Makes a request to delete multiple messages.
             * If messages array contains instances of IMessage, parameter channel is not required as it will be determined from the first message instance. Also deleted messages will be omitted from the request.
             * If messages array is empty, returned promise resolves instantly without sending a request.
             */
            deleteMessages(messages: (IMessage | string)[], channel?: IChannel | string): Promise<void>;
            /**
             * Resolves user and channel references to proper names. References that are not found in cache will be left as is and not resolved.
             */
            resolveContent(content: string, guild?: IGuild | string): String;
            /**
             * Returns an an element, if key of an element in the collection with exact value can be found. Otherwise null is returned.
             */
            getBy(key, value): any;
            /**
             * Returns an element with requested id, if exists in the collection. Otherwise null is returned.
             */
            get(id: string): IMessage;
            /**
             * Creates a new array with all elements that pass the test implemented by the provided function.
             */
            filter(fn: (m: IMessage) => boolean): IMessage[];
            /**
             * Returns a value in the collection, if an element in the collection satisfies the provided testing function. Otherwise null is returned.
             */
            find(fn: (m: IMessage) => boolean): IMessage;
            /**
             * Executes a provided function once per element.
             */
            forEach(fn: (m: IMessage) => void);
            /**
             * Creates a new array with the results of calling a provided function on every element in this collection.
             */
            map<T>(fn: (m: IMessage) => T): T[];
            /**
             * Creates a new array with elements of this collection.
             */
            toArray(): IMessage[];
        }

        interface IPermissionOverwrite {
            id: String;
            type: String;
            allow: IPermissions;
            deny: IPermissions;

            /**
             * Loads original permissions from cache and updates this object.
             */
            reload();
            /**
             * Makes a request to commit changes made to this permission overwrite object.
             */
            commit(): Promise<IPermissionOverwrite>;
            /**
             * Makes a request to delete this permission overwrite.
             */
            delete(): Promise<void>;
        }

        interface IPermissions {
            General: {
                CREATE_INSTANT_INVITE: boolean;
                KICK_MEMBERS: boolean;
                BAN_MEMBERS: boolean;
                ADMINISTRATOR: boolean;
                MANAGE_CHANNELS: boolean;
                MANAGE_GUILD: boolean;
                CHANGE_NICKNAME: boolean;
                MANAGE_NICKNAMES: boolean;
                MANAGE_ROLES: boolean;
                MANAGE_WEBHOOKS: boolean;
                MANAGE_EMOJIS: boolean;
            };

            Text: {
                READ_MESSAGES: boolean;
                SEND_MESSAGES: boolean;
                SEND_TTS_MESSAGES: boolean;
                MANAGE_MESSAGES: boolean;
                EMBED_LINKS: boolean;
                ATTACH_FILES: boolean;
                READ_MESSAGE_HISTORY: boolean;
                MENTION_EVERYONE: boolean;
                EXTERNAL_EMOTES: boolean;
            };

            Voice: {
                CONNECT: boolean;
                SPEAK: boolean;
                MUTE_MEMBERS: boolean;
                DEAFEN_MEMBERS: boolean;
                MOVE_MEMBERS: boolean;
                USE_VAD: boolean;
            };
        }

        interface IRole {
            id: String;
            name: String;
            permissions: IPermissions;
            mentionable: boolean;
            position: Number;
            hoist: boolean;
            color: Number;
            managed: boolean;

            /**
             * Creates a mention from this role's id.
             */
            mention: String;
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;

            /**
             * Loads original permissions from cache and updates this object.
             */
            reload();
            /**
             * Makes a request to commit changes made to this role object.
             */
            commit(name?: string, color?: number, hoist?: boolean, mentionable?: boolean): Promise<void>;
            /**
             * Moves this role to position and makes a batch role update request.
             */
            setPosition(position: number): Promise<void>;
            /**
             * Makes a request to delete this role.
             */
            delete(): Promise<void>;
        }

        interface ITextChannel {
            id: String;
            name: String;
            topic: String;
            position: Number;
            type: Number;
            guild_id: String;
            recipients: Set<IUser>;
            permission_overwrites: IPermissionOverwrite[];
            bitrate: Number;
            user_limit: Number;
            owner_id: String;
            icon: String;

            /**
             * Creates a mention from this channel's id.
             */
            mention: String;
            /**
             * Creates an array of IGuildMember that have permissions to read this channel.
             */
            members: IGuildMember[];
            /**
             * Gets a value indicating whether it is a default (general) channel.
             */
            isDefaultChannel: boolean;
            /**
             * Gets a value indicating whether all messages were loaded.
             */
            allMessagesLoaded: boolean;
            /**
             * Creates an array of cached messages in this channel, sorted in order of arrival (message cache is sorted on message insertion, not when this getter is invoked).
             * Returns an empty array if channel no longer exists.
             * * Note: Message cache also includes deleted messages. You can filter them by checking IMessage.deleted boolean.
             */
            messages: IMessage[];
            /**
             * Creates an array of cached pinned messages in this channel.
             * Pinned message cache is updated only if all pinned messages have been loaded with ITextChannel.fetchPinned().
             * Returns an empty array if channel no longer exists or if pinned messages have not been fetched yet.
             */
            pinnedMessages: IMessage[];
            /**
             * * Deprecated: Removed in API v6. Use isPrivate instead.
             */
            is_private: boolean;
            /**
             * Checks whether this channel is a direct message channel or a group.
             */
            isPrivate: boolean;
            /**
             * Gets guild of this channel.
             */
            guild: IGuild;
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;

            /**
             * Makes a request to fetch messages for this channel.
             * Discord API does not allow fetching more than 100 messages at once.
             */
            fetchMessages(limit?: number | null, before?: IMessage | string | null, after?: IMessage | string | null): Promise<FetchMessagesResult>;
            /**
             * Makes a request to fetch pinned messages for this channel.
             */
            fetchPinned(): Promise<FetchPinnedResult>;
            /**
             * Makes a request to send a message to this channel. Messages over 2000 characters will be rejected by the server.
             * Use uploadFile if you want to send a message with an attachment.
             */
            sendMessage(content: string | string[], mentions?: IUser | IGuildMember | IUser[] | IGuildMember[], tts?: boolean): Promise<IMessage>;
            /**
             * Makes a request to send typing status for this channel.
             * Discord client displays it for 10 seconds, sends every 5 seconds. Stops showing typing status if receives a message from the user.
             */
            sendTyping(): Promise<void>;
            /**
             * Makes a request to upload data to this channel. Images require a filename with a valid extension to actually be uploaded.
             */
            uploadFile(readableStream: Buffer | NodeJS.ReadableStream | string, filename: string, content?: string, tts?: boolean): Promise<IMessage>;
            /**
             * Makes a request to create an invite for this channel.
             */
            createInvite(options: InviteOptions): Promise<IInvite>;
            /**
             * Makes a request to create a permission overwrite for this channel.
             */
            createPermissionOverwrite(roleOrMember: IAuthenticatedUser | IRole | IGuildMember, allow?: IPermissions | number, deny?: IPermissions | number): Promise<IPermissionOverwrite>;
            /**
             * Makes a request to update this channel.
             */
            update(name?: string, topic?: string, bitrate?: number, userLimit?: number): Promise<IChannel>;
            /**
             * Makes a request to create a new channel with permission overwrites of this channel.
             */
            clone(name: string, type?: number, bitrate?: number, userLimit?: number);
            /**
             * Moves this channel to position and makes a batch channel update request.
             */
            setPosition(position: number): Promise<void>;
            /**
             * Makes a request to delete this channel.
             */
            delete(): Promise<void>;
            /**
             * Makes a request to get a list of invites for this channel.
             */
            getInvites(): Promise<IInvite[]>;
        }

        interface IUser {
            id: String;
            username: String;
            discriminator: String;
            avatar: String;
            bot: boolean;

            /**
             * Gets date and time the account was registered (created) at.
             */
            registeredAt: Date;
            /**
             * Gets current avatar URL.
             */
            avatarURL: String | null;
            /**
             * Current status of the user.
             */
            status: String;
            /**
             * Current game the user is playing.
             */
            game: any | null;
            /**
             * Name of the current game the user is playing.
             */
            gameName: String | null;
            /**
             * Previous status of the user.
             */
            previousStatus: String;
            /**
             * Previous game the user was playing.
             */
            previousGame: any | null;
            /**
             * Name of the previous game the user was playing.
             */
            previousGameName: String | null;
            /**
             * Creates a mention from this user's id.
             */
            mention: String;
            /**
             * Creates a nickname mention from this user's id.
             */
            nickMention: String;
            /**
             * Returns true if this is a non-user bot object such as webhook-bot.
             */
            isWebhook: boolean;
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;

            /**
             * Checks whether the user is mentioned in a message.
             */
            isMentioned(message: IMessage, ignoreImplicitMentions: boolean): boolean;
            /**
             * Opens or gets existing Direct Message channel.
             */
            openDM(): Promise<IDirectMessageChannel>;
            /**
             * Attempts to get a guild member interface, returns null if this user is not a member of the guild or guild is not in cache.
             */
            memberOf(guild: IGuild | string): IGuildMember | null;
            /**
             * Resolves permissions for user in context.
             * Returns a helper object with getter boolean properties.
             */
            permissionsFor(context: IChannel | IGuild): IPermissions;
            /**
             * Resolves permissions for user in context and checks if user has permission.
             * See IUser.permissionsFor method for list of throwable errors.
             */
            can(permission: number, context: IChannel | IGuild): boolean;
            /**
             * Gets the first voice channel that member of guild currently in.
             */
            getVoiceChannel(guild: IGuild | string | null): IVoiceChannel;
        }

        interface IUserCollection {
            /**
             * Number of elements in this collection.
             */
            length: Number;
            /**
             * Number of elements in this collection. Alias for .length.
             */
            size: Number;

            /**
             * Request members and wait until cache populates for all guilds or an array of guilds. Request is made over gateway websocket.
             * 
             * Will request members for all guilds if no arguments passed.
             * 
             * By default Discord sends only online members if there are more than 250 (offline and online total) joined in a guild.
             * 
             * Returned promise will resolve when all members have been fetched. Returned promise will reject if all or some members have not been received within 60 seconds or primary gateway websocket disconnected.
             * 
             * If all members for chosen guilds are already in cache - returns a resolved promise.
             * * Note: When guilds become unavailable or deleted (events GUILD_UNAVAILABLE and GUILD_DELETE) all members will also be deleted from cache.
             */
            fetchMembers(guilds?: IGuild | string | (IGuild|string)[]): Promise<void>;
            /**
             * Gets a IGuildMember for specified user of guild.
             * 
             * Returns null if the user is not a member of the guild.
             */
            getMember(guild: IGuild | string, user: IUser | string): IGuildMember;
            /**
             * Creates an array of IGuildMember for guild.
             */
            membersForGuild(guild): IGuildMember[];
            /**
             * Creates an array of IGuildMember that have permissions to read channel.
             * * Note: This method computes permissions for all members and may be CPU intensive for large guilds.
             */
            membersForChannel(channel): IGuildMember[];
            /**
             * Creates an array of IGuildMember containing active members in a voice channel.
             */
            membersInVoiceChannel(channel): IGuildMember[];
            /**
             * Creates an array of IUser containing users in a private voice channel.
             */
            usersInCall(channel): IUser[];
            /**
             * Creates an array of IGuildMember for guild that are currently online.
             */
            onlineMembersForGuild(guild): IGuildMember[];
            /**
             * Creates an array of IGuildMember that have permissions to read channel and currently online.
             * * Note: This method computes permissions for all members and may be CPU intensive for large guilds.
             */
            onlineMembersForChannel(channel): IGuildMember[];
            /**
             * Creates an array of IGuildMember for guild that are currently offline.
             * 
             * Does not guarantee every offline member unless IUserCollection.fetchMembers has been called for the guild.
             */
            offlineMembersForGuild(guild): IGuildMember[];
            /**
             * Creates an array of IGuildMember that have permissions to read channel and currently offline.
             * 
             * Does not guarantee every offline member unless IUserCollection.fetchMembers has been called for the guild the channel belongs to.
             * * Note: This method computes permissions for all members and may be CPU intensive for large guilds.
             */
            offlineMembersForChannel(channel): IGuildMember[];
            /**
             * Returns an an element, if key of an element in the collection with exact value can be found. Otherwise null is returned.
             */
            getBy(key, value): any;
            /**
             * Returns an element with requested id, if exists in the collection. Otherwise null is returned.
             */
            get(id): any;
            /**
             * Creates a new array with all elements that pass the test implemented by the provided function.
             */
            filter(fn): any[];
            /**
             * Returns a value in the collection, if an element in the collection satisfies the provided testing function. Otherwise null is returned.
             */
            find(fn): any;
            /**
             * Executes a provided function once per element.
             */
            forEach(fn);
            /**
             * Creates a new array with the results of calling a provided function on every element in this collection.
             */
            map<T>(fn: (u: IUser) => T): T[];
            /**
             * Creates a new array with elements of this collection.
             */
            toArray(): IUser[];
        }

        interface IVoiceChannel {
            id: String;
            name: String;
            topic: String;
            position: Number;
            type: Number;
            guild_id: String;
            recipients: Set<IUser>;
            permission_overwrites: IPermissionOverwrite[];
            bitrate: Number;
            user_limit: Number;
            owner_id: String;
            icon: String;

            /**
             * Creates an array of members joined in this voice channels.
             */
            members: IGuildMember[];
            /**
             * Checks whether current user is in this voice channel.
             */
            joined: boolean;
            /**
             * * Deprecated: Removed in API v6. Use isPrivate instead.
             */
            is_private: boolean | null;
            /**
             * Checks whether this channel is a direct message channel or a group.
             */
            isPrivate: boolean | null;
            /**
             * Gets guild of this channel.
             */
            guild: IGuild | null;
            /**
             * Gets date and time this object was created at.
             */
            createdAt: Date;

            /**
             * Joins this voice channel. Creates a new voice connection if there are no active connections for this channels' guild.
             * * Note: One account can be only in one channel per guild. Promise will resolve instantly and contain the same instance if connection to the server is already established.
             */
            join(selfMute?: boolean, selfDeaf?: boolean): Promise<VoiceConnectionInfo>;
            /**
             * Leaves this voice channel if joined.
             */
            leave();
            /**
             * Retrieves VoiceConnectionInfo for this voice channel.
             */
            getVoiceConnectionInfo(): VoiceConnectionInfo | null;
            /**
             * Makes a request to create an invite for this channel.
             */
            createInvite(options: InviteOptions): Promise<IInvite>;
            /**
             * Makes a request to create a permission overwrite for this channel.
             */
            createPermissionOverwrite(roleOrMember: IAuthenticatedUser | IRole | IGuildMember, allow?: IPermissions | number, deny?: IPermissions | number): Promise<IPermissionOverwrite>;
            /**
             * Makes a request to update this channel.
             */
            update(name?: string, topic?: string, bitrate?: number, userLimit?: number): Promise<IChannel>;
            /**
             * Makes a request to create a new channel with permission overwrites of this channel.
             */
            clone(name: string, type?: number, bitrate?: number, userLimit?: number);
            /**
             * Moves this channel to position and makes a batch channel update request.
             */
            setPosition(position: number): Promise<void>;
            /**
             * Makes a request to delete this channel.
             */
            delete(): Promise<void>;
            /**
             * Makes a request to get a list of invites for this channel.
             */
            getInvites(): Promise<IInvite[]>;
        }

        interface IVoiceConnection {
            /**
             * Checks whether this voice connection is no longer valid.
             */
            disposed: boolean;
            /**
             * Checks whether this voice connection is fully initialized.
             */
            canStream: boolean;
            /**
             * Gets channel of this voice connection.
             * 
             * Returns last channel it was connected to if voice connection has been disposed. Returns null if guild became unavailable or channel doesn't exist in cache.
             */
            channel: IChannel | null;
            /**
             * Gets channel id of this voice connection.
             * 
             * Returns last channel id it was connected to if voice connection has been disposed.
             */
            channelId: String | null;
            /**
             * Gets guild of this voice connection.
             * 
             * Returns null if this is a private call, or guild became unavailable or doesn't exist in cache.
             */
            guild: IGuild | null;
            /**
             * Gets guild id of this voice connection.
             * 
             * Returns null if this is a private call.
             */
            guildId: String | null;

            /**
             * Resolves a user object from source id assigned to this voice connection.
             */
            ssrcToUser(ssrc: number): IUser;
            /**
             * Resolves a member object from source id assigned to this voice connection.
             */
            ssrcToMember(ssrc: number): IGuildMember;
            /**
             * Initializes encoder and gets stream for this voice connection.
             * 
             * Calls without arguments return existing encoder without reinitialization.
             * 
             * See AudioEncoder.initialize() method for list of options.
             */
            getEncoderStream(options?): AudioEncoderStream;
            /**
             * Creates an external encoder.
             * 
             * Accepts options object with type property (default {type: "ffmpeg"}). Each type supports additional options. See docs for returned classes for usage info.
             */
            createExternalEncoder(options?): FFmpegEncoder | OggOpusPlayer | WebmOpusPlayer;
            /**
             * Initializes encoder instance for this voice connection.
             * Calls without arguments return existing encoder without reinitialization.
             * See AudioEncoder.initialize() method for list of options.
             */
            getEncoder(options?): AudioEncoder;
            /**
             * Initializes decoder instance for this voice connection.
             * Calls without arguments return existing decoder without reinitialization.
             */
            getDecoder(options?): any;
            /**
             * Disconnects this voice connection.
             */
            disconnect();
        }

        interface IWebhookManager {
            /**
             * * Requires logging in with an API token.
             * Makes a request to get webhook objects for the specified guild.
             */
            fetchForGuild(guild: IGuild | string): Promise<any[]>;
            /**
             * * Requires logging in with an API token.
             * Makes a request to get webhook objects for the specified channel.
             */
            fetchForChannel(channel: IChannel): Promise<any[]>;
            /**
             * * Requires logging in with an API token.
             * Makes a request to create a webhook for the channel.
             * Promise resolves with a webhook any.
             */
            create(channel: IChannel, options: { name: string; avatar: Buffer | string | null; }): Promise<any>;
            /**
             * Makes a request to fetch a webhook any.
             * Promise resolves with a webhook object (does not contain a user object if fetched with token param).
             */
            fetch(webhook: any | string, token: string): Promise<any>;
            /**
             * Makes a request to edit the specified webhook.
             * Promise resolves with a webhook object (does not contain a user object if edited with token param).
             */
            edit(webhook: any | string, token: string, options: any): Promise<any>;
            /**
             * Makes a request to delete the specified webhook.
             */
            delete(webhook: any | string, token: string): Promise<void>;
            /**
             * Makes a request to execute the specified webhook.
             * Note: Embeds in file uploads are not supported.
             */
            execute(webhook: any | string, token: string, options: any, wait?: boolean): Promise<void>;
            /**
             * Makes a request to execute the specified webhook with slack-compatible options.
             */
            executeSlack(webhook: any | string, token: string, options: any, wait?: boolean): Promise<void>;
        }
    }

    export = Discordie;
}
