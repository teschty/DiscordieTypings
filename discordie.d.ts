declare module "discordie" {
    import * as events from "events";
    import * as stream from "stream";

    class VoiceConnectionInfo {
        /*public gatewaySocket: GatewaySocket;
        public voiceSocket: VoiceSocket;*/
        public voiceConnection: IVoiceConnection;
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

    class Discordie {
        /**
         * Primary event bus.
         */
        public Dispatcher: events.EventEmitter;
        /**
         * Represents current user.
         */
        public User: IAuthenticatedUser;
        /**
         * Interface to a collection containing all "Discord Servers" (internally called guilds) current session is connected to. Does not contain unavailable guilds.
         */
        public Guilds: IGuildCollection;
        /**
         * Interface to a collection containing all public channels current session is connected to.
         */
        public Channels: IChannelCollection;
        /**
         * Interface to a collection containing all users current session has been exposed to.
         * Contains only online users after READY. See documentation for IUserCollection.fetchMembers(guilds) if you want to load offline members too.
         */
        public Users: IUserCollection;
        /**
         * Interface to a collection containing all private (direct message) channels current session is connected to.
         */
        public DirectMessageChannels: IDirectMessageChannelCollection;
        /**
         * Interface to a collection containing all cached messages.
         */
        public Messages: IMessageCollection;
        /**
         * An instance of IInviteManager.
         */
        public Invites: IInviteManager;
        /**
         * An instance of IWebhookManager.
         */
        public Webhooks: IWebhookManager;
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
        public voiceConnection: IVoiceConnection;

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
        public voiceConnection: IVoiceConnection;

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
        public voiceConnection: IVoiceConnection;

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
        game: Object;
        afk: boolean;

        registeredAt: Date;
        avatarURL: String;
        isClaimedAccount: boolean;
        gameName: String;
        mention: String;
        nickMention: String;
        createdAt: Date;
    }

    interface ICall {
        isMentioned(message, ignoreImplicitMentions): boolean;
        getApplication(): Promise<Object>;
        edit(currentPassword, username?, avatar?, email?, newPassword?): Promise<IUser>;
        setAvatar(avatar, currentPassword?): Promise<IUser>;
        setUsername(username, currentPassword?): Promise<IUser>;
        setStatus(status, game?);
        setGame(game);
        memberOf(guild): IGuildMember;
        permissionsFor(context): IPermissions;
        can(permission, context): boolean;
        getVoiceChannel(guild): IVoiceChannel;
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
        is_private: boolean;
        isPrivate: boolean;
        guild: IGuild;
        createdAt: Date;

        createInvite(options): Promise<Object>;
        createPermissionOverwrite(roleOrMember, allow?, deny?): Promise<IPermissionOverwrite>;
        update(name?, topic?, bitrate?, userLimit?): Promise<IChannel>;
        clone(name, type?, bitrate?, userLimit?);
        setPosition(position): Promise<void>;
        delete(): Promise<void>;
        getInvites(): Promise<Object[]>;
    }

    interface IChannelCollection { 
        length: Number;
        size: Number;
        forGuild(guild): IChannel[];
        textForGuild(guild): ITextChannel[];
        voiceForGuild(guild): IVoiceChannel[];
        getBy(key, value): any;
        get(id): any;
        filter(fn): any[];
        find(fn): Object;
        forEach(fn);
        map(fn): any[];
        toArray(): any[];
    }

    interface IDirectMessageChannel {
        id: String;
        name: String;
        topic: String;
        position: Number;
        type: Number;
        guild_id: String;
        recipients: IUser[];
        permission_overwrites: any[];
        bitrate: Number;
        user_limit: Number;
        owner_id: String;
        icon: String;
        is_private: boolean;
        isPrivate: boolean;
        owner: IAuthenticatedUser | IUser;
        iconURL: String;
        recipient: IUser;
        allMessagesLoaded: boolean;
        messages: IMessage[];
        pinnedMessages: IMessage[];
        joinedCall: boolean;
        usersInCall: IUser[];
        call: ICall;
        createdAt: Date;
        isOwner(user): boolean;
        fetchMessages(limit?, before?, after?): Promise<Object>;
        fetchPinned(): Promise<Object>;
        sendMessage(content, mentions?, tts?): Promise<IMessage>;
        uploadFile(readableStream, filename, content?, tts?): Promise<IMessage>;
        sendTyping(): Promise<void>;
        close(): Promise<void>;
        ring(recipients?): Promise<void>;
        stopRinging(recipients?): Promise<void>;
        changeCallRegion(region): Promise<void>;
        addRecipient(user): Promise<void>;
        removeRecipient(user): Promise<void>;
        setName(name): Promise<IDirectMessageChannel>;
        setIcon(icon): Promise<IDirectMessageChannel>;
        joinCall(selfMute?, selfDeaf?): Promise<VoiceConnectionInfo>;
        leaveCall();
        getVoiceConnectionInfo(): VoiceConnectionInfo;
        fetchCall(): Promise<(ICall|null)>;
    }

    interface IDirectMessageChannelCollection { 
        length: Number;
        size: Number;
        getOrOpen(recipient): Promise<IDirectMessageChannel>;
        open(recipient): Promise<IDirectMessageChannel>;
        createGroupDM(recipients?): Promise<IDirectMessageChannel>;
        getBy(key, value): any;
        get(id): any;
        filter(fn): any[];
        find(fn): Object;
        forEach(fn);
        map(fn): any[];
        toArray(): any[];
    }

    interface IGuild { 
        id: String;
        name: String;
        owner_id: String;
        icon: String;
        splash: String;
        features: Set<any>;
        emojis: Object[];
        default_message_notifications: Number;
        roles: IRole[];
        afk_channel_id: String;
        afk_timeout: Number;
        verification_level: Number;
        region: String;
        member_count: Number;
        large: Boolean;
        mfa_level: Number;
        joined_at: String;
        acronym: String;
        iconURL: String;
        splashURL: String;
        afk_channel: IChannel;
        owner: IAuthenticatedUser | IUser;
        channels: IChannel[];
        textChannels: ITextChannel[];
        voiceChannels: IVoiceChannel[];
        generalChannel: ITextChannel;
        members: IGuildMember[];
        createdAt: Date;
        isOwner(user): boolean;
        edit(name?, icon?, region?, afkChannelId?, afkTimeout?, verificationLevel?, defaultMessageNotifications?): Promise<IGuild>;
        createChannel(type, name, permissionOverwrites?, bitrate?, userLimit?): Promise<(ITextChannel|IVoiceChannel)>;
        createRole(): Promise<IRole>;
        createInvite(options): Promise<Object>;
        delete(): Promise<void>;
        leave(): Promise<void>;
        ban(user, deleteMessageForDays): Promise<void>;
        unban(user): Promise<void>;
        getBans(): Promise<IUser[]>;
        getPruneEstimate(days): Promise<Object>;
        pruneMembers(days): Promise<Object>;
        getInvites(): Promise<Object[]>;
        fetchRegions(): Promise<Object[]>;
        transferOwnership(user): Promise<IGuild>;
        getWidget(): Promise<Object>;
        editWidget(options): Promise<Object>;
        fetchEmoji(): Promise<Object[]>;
        uploadEmoji(image, name): Promise<Object>;
        deleteEmoji(emoji): Promise<Object>;
        editEmoji(emoji, options): Promise<Object>;
        getEmojiURL(): String;
    }

    interface IGuildCollection { 
        length: Number;
        size: Number;
        create(name, region, icon?, roles?, channels?, verificationLevel?, defaultMessageNotifications?): Promise<IGuild>;
        fetchRegions(): Promise<Object[]>;
        getBy(key, value): any;
        get(id): any;
        filter(fn): any[];
        find(fn): Object;
        forEach(fn);
        map(fn): any[];
        toArray(): any[];
    }

    interface IGuildMember { 
        id: String;
        guild_id: String;
        nick: String;
        roles: IRole[];
        mute: boolean;
        deaf: boolean;
        self_mute: boolean;
        self_deaf: boolean;
        joined_at: String;
        username: String;
        discriminator: String;
        avatar: String;
        bot: boolean;
        status: String;
        game: Object;
        gameName: String;
        previousStatus: String;
        previousGame: Object;
        previousGameName: String;
        guild: IGuild;
        name: String;
        registeredAt: Date;
        avatarURL: String;
        mention: String;
        nickMention: String;
        isWebhook: boolean;
        createdAt: Date;
        getVoiceChannel(): IVoiceChannel;
        kick(): Promise<void>;
        ban(deleteMessageForDays): Promise<void>;
        unban(): Promise<void>;
        serverMute(): Promise<void>;
        serverUnmute(): Promise<void>;
        serverDeafen(): Promise<void>;
        serverUndeafen(): Promise<void>;
        hasRole(role): Promise<void>;
        assignRole(role): Promise<void>;
        unassignRole(role): Promise<void>;
        setRoles(roles): Promise<void>;
        setChannel(channel): Promise<void>;
        setNickname(nick): Promise<void>;
        isMentioned(message, ignoreImplicitMentions): boolean;
        openDM(): Promise<IDirectMessageChannel>;
        memberOf(guild): IGuildMember;
        permissionsFor(context): IPermissions;
        can(permission, context): boolean;
    }

    interface IInviteManager { 
        create(channel, options): Promise<Object>;
        regenerate(code): Promise<Object>;
        revoke(code): Promise<Object>;
        resolve(code): Promise<Object>;
        accept(code): Promise<Object>;
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
        isCached: boolean;
        isEdited: boolean;
        isPrivate: boolean;
        isSystem: boolean;
        systemMessage: String;
        displayUsername: String;
        channel: ITextChannel | IDirectMessageChannel;
        guild: IGuild;
        member: IGuildMember;
        edits: Object[];
        createdAt: Date;
        call: Object;
        resolveContent(): String;
        edit(content): Promise<IMessage>;
        delete(): Promise<void>;
        pin(): Promise<IMessage>;
        unpin(): Promise<IMessage>;
        reply(content, mentions?, tts?): Promise<IMessage>;
    }

    interface IMessageCollection { 
        length: Number;
        size: Number;
        forChannel(channel): IMessage[];
        purgeChannelCache(channel);
        forChannelPinned(channel): IMessage[];
        purgeChannelPinned(channel);
        purgePinned();
        purgeEdits();
        purgeAllCache();
        getChannelMessageLimit(channel): Number;
        setChannelMessageLimit(channel, limit): Boolean;
        getMessageLimit(): Number;
        setMessageLimit(limit);
        getEditsLimit(): Number;
        setEditsLimit(limit);
        editMessage(content, messageId, channelId): Promise<Object>;
        deleteMessage(messageId, channelId): Promise<void>;
        pinMessage(messageId, channelId): Promise<void>;
        unpinMessage(messageId, channelId): Promise<void>;
        deleteMessages(messages, channel?): Promise<void>;
        resolveContent(content, guild?): String;
        getBy(key, value): any;
        get(id): any;
        filter(fn): any[];
        find(fn): Object;
        forEach(fn);
        map(fn): any[];
        toArray(): any[];
    }

    interface IPermissionOverwrite { 
        id: String;
        type: String;
        allow: IPermissions;
        deny: IPermissions;
        reload();
        commit(): Promise<IPermissionOverwrite>;
        delete(): Promise<void>;
    }

    interface IPermissions { 

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
        mention: String;
        createdAt: Date;
        reload();
        commit(name?, color?, hoist?, mentionable?): Promise<void>;
        setPosition(position): Promise<void>;
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
        mention: String;
        members: IGuildMember[];
        isDefaultChannel: boolean;
        allMessagesLoaded: boolean;
        messages: IMessage[];
        pinnedMessages: IMessage[];
        is_private: boolean;
        isPrivate: boolean;
        guild: IGuild;
        createdAt: Date;
        fetchMessages(limit?, before?, after?): Promise<Object>;
        fetchPinned(): Promise<Object>;
        sendMessage(content, mentions?, tts?): Promise<IMessage>;
        sendTyping(): Promise<void>;
        uploadFile(readableStream, filename, content?, tts?): Promise<IMessage>;
        createInvite(options): Promise<Object>;
        createPermissionOverwrite(roleOrMember, allow?, deny?): Promise<IPermissionOverwrite>;
        update(name?, topic?, bitrate?, userLimit?): Promise<IChannel>;
        clone(name, type?, bitrate?, userLimit?);
        setPosition(position): Promise<void>;
        delete(): Promise<void>;
        getInvites(): Promise<Object[]>;
    }

    interface IUser { 
        id: String;
        username: String;
        discriminator: String;
        avatar: String;
        bot: boolean;
        registeredAt: Date;
        avatarURL: String;
        status: String;
        game: Object;
        gameName: String;
        previousStatus: String;
        previousGame: Object;
        previousGameName: String;
        mention: String;
        nickMention: String;
        isWebhook: boolean;
        createdAt: Date;
        isMentioned(message, ignoreImplicitMentions): boolean;
        openDM(): Promise<IDirectMessageChannel>;
        memberOf(guild): IGuildMember;
        permissionsFor(context): IPermissions;
        can(permission, context): boolean;
        getVoiceChannel(guild): IVoiceChannel;
    }

    interface IUserCollection { 
        length: Number;
        size: Number;
        fetchMembers(guilds?): Promise<void>;
        getMember(guild, user): IGuildMember;
        membersForGuild(guild): IGuildMember[];
        membersForChannel(channel): IGuildMember[];
        membersInVoiceChannel(channel): IGuildMember[];
        usersInCall(channel): IUser[];
        onlineMembersForGuild(guild): IGuildMember[];
        onlineMembersForChannel(channel): IGuildMember[];
        offlineMembersForGuild(guild): IGuildMember[];
        offlineMembersForChannel(channel): IGuildMember[];
        getBy(key, value): any;
        get(id): any;
        filter(fn): any[];
        find(fn): Object;
        forEach(fn);
        map(fn): any[];
        toArray(): any[];
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
        members: IGuildMember[];
        joined: boolean;
        is_private: boolean;
        isPrivate: boolean;
        guild: IGuild;
        createdAt: Date;
        join(selfMute?, selfDeaf?): Promise<VoiceConnectionInfo>;
        leave();
        getVoiceConnectionInfo(): VoiceConnectionInfo;
        createInvite(options): Promise<Object>;
        createPermissionOverwrite(roleOrMember, allow?, deny?): Promise<IPermissionOverwrite>;
        update(name?, topic?, bitrate?, userLimit?): Promise<IChannel>;
        clone(name, type?, bitrate?, userLimit?);
        setPosition(position): Promise<void>;
        delete(): Promise<void>;
        getInvites(): Promise<Object[]>;
    }

    interface IVoiceConnection { 
        disposed: boolean;
        canStream: boolean;
        channel: IChannel;
        channelId: String;
        guild: IGuild;
        guildId: String;
        ssrcToUser(ssrc): IUser;
        ssrcToMember(ssrc): IGuildMember;
        getEncoderStream(options?): AudioEncoderStream;
        createExternalEncoder(options?): FFmpegEncoder | OggOpusPlayer | WebmOpusPlayer;
        getEncoder(options?): AudioEncoder;
        getDecoder(options?): any;
        disconnect();
    }

    interface IWebhookManager { 
        fetchForGuild(guild): Promise<Object[]>;
        fetchForChannel(channel): Promise<Object[]>;
        create(channel, options): Promise<Object>;
        fetch(webhook, token): Promise<Object>;
        edit(webhook, token, options): Promise<Object>;
        delete(webhook, token): Promise<void>;
        execute(webhook, token, options, wait?): Promise<void>;
        executeSlack(webhook, token, options, wait?): Promise<void>;
    }

    namespace Discordie {}
    export = Discordie;
}