from django.contrib import admin
from .models import NewUser
from django.contrib.auth.admin import UserAdmin

class UserAdminConfig(UserAdmin):
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff')
    list_filter = ('email', 'username', 'first_name', 'last_name', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff')}),
        ('Personal', {'fields':('about','profile_pic')}),                                                                     
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff')}),
    )


admin.site.register(NewUser, UserAdminConfig)